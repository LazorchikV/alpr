import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as ort from 'onnxruntime-node'; // ONNX Runtime for YOLO
import * as Jimp from 'jimp';
import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { recognizeWithEasyOCR } from "../EasyOCR/ocrService";
import { IOpenAlprService } from '../open-alpr/open-alpr.service';
import { IRecognition } from './interfaces';


export interface IAlprService<T> {
  recognizePlate(s3Key: string): Promise<{ recognizedPlate: IRecognition[]; }>;
}

@Injectable()
export class AlprService<T> implements IAlprService<T> {
  private session: ort.InferenceSession | null = null;

  constructor(
    @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
    @Inject(Service.OpenAlpr) private readonly openAlprService: IOpenAlprService<T>,
  ) {
    this.loadModel();
  }

  private async loadModel() {
    this.session = await ort.InferenceSession.create('yolov8n.onnx');
    console.log('✅ YOLOv8 Model Loaded');
    console.log('✅ Model Input Names:', this.session.inputNames);
  }

  public async recognizePlate(s3Key: string): Promise<{ recognizedPlate: IRecognition[]; }> {
    try {
      if (!this.session) throw new Error("Model not loaded");

      // 1️⃣ Downloading an image from S3
      const localPath = await this.awsService.downloadFromS3(s3Key);
      if (!fs.existsSync(localPath)) throw new Error(`File not found: ${localPath}`);

      const openAlprResults = await this.openAlprService.recognizePlate(localPath);

      // 2️⃣ Load the image and scale it
      const img = await Jimp.read(localPath);
      img.resize(640, 640); // YOLO required 640x640

      // 📌 Jimp stores pixels in RGBA format, but YOLO requires RGB
      const rgbData = new Float32Array(3 * 640 * 640);
      const rgbaData = img.bitmap.data; // Uint8Array with RGBA channels

      for (let i = 0, j = 0; i < rgbaData.length; i += 4, j += 3) {
        rgbData[j] = rgbaData[i] / 255;     // R
        rgbData[j + 1] = rgbaData[i + 1] / 255; // G
        rgbData[j + 2] = rgbaData[i + 2] / 255; // B
      }

      // 3️⃣ Convert to tensor and feed to YOLO
      const inputTensor = new ort.Tensor("float32", rgbData, [1, 3, 640, 640]);

      const results = await this.session.run({ images: inputTensor });
      const predictions = this.postprocessResults(results);

      if (!predictions.length && !openAlprResults?.length) return { recognizedPlate: [{ text: "Not Found" }]};

      // 4️⃣ Cut out the number plate
      const { x, y, width, height } = predictions[0];

      const cropped = img.crop(x, y, width, height);
      const croppedPath = "cropped_plate.jpg";
      await cropped.writeAsync(`./temp/${croppedPath}`);

      // 5️⃣ Recognize a number with Python EasyOCR
      const ocrResult= await recognizeWithEasyOCR(localPath);
      const recognizedPlate = ocrResult.length > 0 ? [...openAlprResults, ...ocrResult] : [{text: "Not Found"}];

      return { recognizedPlate };
    } catch (error) {
      console.error("❌ Error:", error);
      return { recognizedPlate: [{text: "Error in recognition"}] };
    }
  }

  private postprocessResults(results: any) {
    const predictions: { x: number; y: number; width: number; height: number }[] = [];
    const outputData = results.output0.cpuData as Float32Array;
    const numDetections = 8400;

    for (let i = 0; i < numDetections; i++) {
      const index = i * 84;
      const xCenter = outputData[index];
      const yCenter = outputData[index + 1];
      const width = outputData[index + 2];
      const height = outputData[index + 3];
      const confidence = outputData[index + 4];

      if (confidence > 0) {
        predictions.push({
          x: xCenter,
          y: yCenter,
          width,
          height,
        });
      }
    }
    return predictions;
  }
}