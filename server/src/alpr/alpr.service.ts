import { Inject, Injectable } from '@nestjs/common';
import * as cv from 'opencv4nodejs-prebuilt-install';
import * as Tesseract from 'tesseract.js';
import * as fs from 'fs';
import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { PSM } from 'tesseract.js';

export interface IAlprService<T> {
  recognizePlate(s3Key: string): Promise<string>;
}


@Injectable()
export class AlprService<T> implements IAlprService<T> {
  constructor(
    @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
  ) {}

  public async recognizePlate(s3Key: string): Promise<string> {
    try {
      // 1️⃣ Скачиваем изображение из S3
      const localPath = await this.awsService.downloadFromS3(s3Key);

      console.log(`Full file path: ${localPath}`);

      // 2️⃣ Загружаем изображение с диска
      const image = cv.imread(localPath);

      // 3️⃣ Обрабатываем изображение (серый цвет + фильтрация)
      const gray = image.bgrToGray();
      const blurred = gray.gaussianBlur(new cv.Size(5, 5), 0);
      const edged = blurred.canny(100, 200);

      // 4️⃣ Поиск контуров (находим номерной знак)
      const contours = edged.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
      let licensePlateRegion = null;

      for (let contour of contours) {
        const rect = contour.boundingRect();
        if (rect.width && rect.height) {
          licensePlateRegion = image.getRegion(new cv.Rect(rect.x, rect.y, rect.width, rect.height));
          break;
        }
      }

      if (!licensePlateRegion) {
        return "No license plate detected";
      }

      const croppedPath = localPath.replace('.jpg', '_cropped.jpg');
      cv.imwrite(croppedPath, licensePlateRegion);

      // 5️⃣ Используем `Tesseract.createWorker()` для OCR
      const worker = await Tesseract.createWorker('eng');
      await worker.load();
      // Инициализируем с языком 'eng' (новый API)
      await worker.reinitialize('eng');

      // 6️⃣ Устанавливаем настройки для распознавания номеров
      await worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-',
        tessedit_pageseg_mode: PSM.AUTO,  // Полностью автоматический
        user_defined_dpi: '300',
      });

      const { data: { text } } = await worker.recognize(croppedPath);

      // 7️⃣ Завершаем работу Tesseract
      await worker.terminate();

      // 8️⃣ Удаляем временные файлы
      fs.unlinkSync(localPath);
      fs.unlinkSync(croppedPath);

      return text.trim();

    } catch (error) {
      console.error("Error in recognizePlate:", error);
      return "Recognition failed";
    }
  }
}