import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';
import * as fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as path from 'node:path';

export interface IAWSService<T> {
    uploadAndAnalyzeImage(imageKey: string, isCustomConfigure?: boolean): Promise<Partial<T>>;
    uploadToS3(file: Express.Multer.File): Promise<string>;
    downloadFromS3(s3Key: string): Promise<string>;
    getImageUrl(imageKey: string): Promise<string>;
}

@Injectable()
export class AWSService<T> implements IAWSService<T> {
    private s3Client: S3Client;
    private rekognitionClient: RekognitionClient;
    private sageMakerRuntimeClient: SageMakerRuntimeClient;
    private readonly bucketName: string;
    private readonly sagemakerEndpoint: string;

    constructor(
        private configService: ConfigService
    ) {
        const region = this.configService.get<string>('AWS_REGION_NAME');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');

        this.s3Client = new S3Client({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.rekognitionClient = new RekognitionClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.sageMakerRuntimeClient = new SageMakerRuntimeClient({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        });

        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
        this.sagemakerEndpoint = this.configService.get<string>('AWS_SAGEMAKER_ENDPOINT_NAME');
    }

    public async getImageUrl(imageKey: string): Promise<string> {
        const params = {
            Bucket: this.bucketName,
            Key: imageKey,
        };
        // Create a signed link with a lifetime (for example, 1 hour)
        const signedUrl = await getSignedUrl(this.s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
        return signedUrl;
    }

    public async uploadAndAnalyzeImage(imageKey: string, isCustomConfigure?: boolean): Promise<Partial<T>> {
        // Image Analysis Using Rekognition
        let analysisResult = await this.analyzeImageWithRekognition(imageKey);

        // For custom configure
        if (isCustomConfigure) {
            analysisResult = await this.analyzeImageWithSageMaker(imageKey);
        }

        return analysisResult as Partial<T>;
    }

    public async uploadToS3(file: Express.Multer.File): Promise<string> {
        const key = `${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        // Uploading the file to S3
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);

        return key;
    }

    public async downloadFromS3(s3Key: string): Promise<string> {
        const params = { Bucket: this.bucketName, Key: s3Key };
        const command = new GetObjectCommand(params);
        const response = await this.s3Client.send(command);

        if (!response.Body) {
            throw new Error(`Failed to download file from S3: ${s3Key}`);
        }

        // Determine the path to the folder and create it if it is missing
        const tmpDir = path.join(__dirname, '/tmp');
        if (!fs.existsSync(tmpDir)) {
            fs.mkdirSync(tmpDir, { recursive: true });
        }

        // Forming the path to the file
        const localPath = path.join(tmpDir, s3Key);
        const fileStream = fs.createWriteStream(localPath);

        // Using pipe via stream and promising it
        const streamPipeline = promisify(pipeline);
        await streamPipeline(response.Body as NodeJS.ReadableStream, fileStream);

        if (!fs.existsSync(localPath)) {
            throw new Error(`File not found: ${localPath}`);
        }

        const stats = fs.statSync(localPath);

        if (stats.size === 0) {
            throw new Error(`Downloaded file is empty: ${localPath}`);
        }

        return localPath;
    }

    async analyzeImageWithRekognition(imageKey: string): Promise<any> {
        const params = {
            Image: {
                S3Object: {
                    Bucket: this.bucketName,
                    Name: imageKey,
                },
            },
            MaxLabels: 10,
            MinConfidence: 75,
        };

        const command = new DetectLabelsCommand(params);
        return await this.rekognitionClient.send(command);
    }

    async analyzeImageWithSageMaker(s3Key: string): Promise<any> {
        // Getting an object from S3
        const getObjectParams = {
            Bucket: this.bucketName,
            Key: s3Key,
        };
        const getObjectCommand = new GetObjectCommand(getObjectParams);
        const s3Object = await this.s3Client.send(getObjectCommand);

        // Convert data to base64
        const imageBase64 = await this.streamToString(s3Object.Body as NodeJS.ReadableStream);

        const params = {
            EndpointName: this.sagemakerEndpoint,
            Body: Buffer.from(imageBase64, 'base64'),
            ContentType: 'application/x-image',
        };

        const command = new InvokeEndpointCommand(params);
        const result = await this.sageMakerRuntimeClient.send(command);

        const resultString = Buffer.from(result.Body as Uint8Array).toString('utf-8');
        return JSON.parse(resultString);
    }

    // Converting a stream to a string
    private async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
            stream.on('error', reject);
        });
    }
}
