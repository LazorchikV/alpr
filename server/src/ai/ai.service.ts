import { Inject, Injectable } from '@nestjs/common';

import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { IAlprService } from '../alpr/alpr.service';

export interface IAIService<T> {
  uploadFile(file: Express.Multer.File): Promise<Partial<T> & {
    imageUrl: string;
    recognizePlate: { text: string; boundingBox: { x: number; y: number; width: number; height: number } }
  }>;
}

@Injectable()
export class AIService<T> implements IAIService<T> {
  constructor(
    @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
    @Inject(Service.Alpr) private readonly alprService: IAlprService<T>,
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<Partial<T> & {
    imageUrl: string;
    recognizePlate: { text: string; boundingBox: { x: number; y: number; width: number; height: number } }
  }> {
    const imageKey = await this.awsService.uploadToS3(file);
    const imageUrl = await this.awsService.getImageUrl(imageKey);
    const kindImage = await this.awsService.uploadAndAnalyzeImage(imageKey);
    const {text, boundingBox} = await this.alprService.recognizePlate(imageKey);

    return {...kindImage, imageUrl, recognizePlate: {text, boundingBox}};
  }
}