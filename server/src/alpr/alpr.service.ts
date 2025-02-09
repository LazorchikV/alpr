import { Inject, Injectable } from '@nestjs/common';
import * as cv from 'opencv4nodejs-prebuilt-install';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { PSM } from 'tesseract.js';

export interface IAlprService<T> {
  recognizePlate(s3Key: string): Promise<{ text: string, boundingBox?: { x: number, y: number, width: number, height: number } }>;
}


@Injectable()
export class AlprService<T> implements IAlprService<T> {
  constructor(
    @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
  ) {}

  public async recognizePlate(s3Key: string): Promise<{ text: string, boundingBox?: { x: number, y: number, width: number, height: number } }> {
    try {
      // 1️⃣ Скачиваем изображение из S3
      const localPath = await this.awsService.downloadFromS3(s3Key);

      // Проверяем, существует ли файл
      if (!fs.existsSync(localPath)) {
        throw new Error(`Файл не найден: ${localPath}`);
      }

      // 2️⃣ Загружаем изображение
      const image = cv.imread(localPath);
      if (image.empty) {
        throw new Error("Ошибка загрузки изображения, пустой объект Mat");
      }

      // 3️⃣ Преобразуем в серый и фильтруем шум
      const gray = image.bgrToGray();
      const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);
      const edged = blurred.canny(100, 200);

      // 4️⃣ Ищем контуры
      const contours = edged.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      let licensePlateRegion: cv.Mat | null = null;
      let boundingBox = null;

      for (let contour of contours) {
        const rect = contour.boundingRect();
        if (rect.width > 50 && rect.height > 20) { // Минимальный размер номера
          licensePlateRegion = image.getRegion(new cv.Rect(rect.x, rect.y, rect.width, rect.height));
          boundingBox = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
          break;
        }
      }

      if (!licensePlateRegion) {
        return { text: "Not Found" };
      }

      // 5️⃣ Сохраняем обработанный регион
      const croppedPath = localPath.replace('.jpg', '_cropped.jpg');
      cv.imwrite(croppedPath, licensePlateRegion);

      // 6️⃣ Запускаем OCR
      const worker = await Tesseract.createWorker('eng');
      await worker.load();
      await worker.reinitialize('eng');

      await worker.setParameters({
        tessedit_pageseg_mode: PSM.AUTO,
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
        user_defined_dpi: '300'
      });

      const { data: { text } } = await worker.recognize(croppedPath);
      await worker.terminate();

      // 7️⃣ Удаляем временные файлы
      fs.unlinkSync(localPath);
      fs.unlinkSync(croppedPath);

      return { text: text.trim(), boundingBox };
    } catch (error) {
      console.error("Error in recognizePlate:", error);
      return { text: "Error in recognize image" };
    }
  }
}