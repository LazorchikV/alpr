import { Inject, Injectable } from '@nestjs/common';
//import * as tf from '@tensorflow/tfjs-node';

import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { IAlprService } from '../alpr/alpr.service';

export interface IAIService<T> {
  uploadFile(file: Express.Multer.File): Promise<{ message: string; answer: Awaited<T>; }>;
}

@Injectable()
export class AIService<T> implements IAIService<T> {
  constructor(
    @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
    @Inject(Service.Alpr) private readonly alprService: IAlprService<T>,
  ) {}

  public async uploadFile(file: Express.Multer.File): Promise<{ message: string; answer: Awaited<T>; }> {
    const imageKey = await this.awsService.uploadToS3(file);
    const kindImage = await this.awsService.uploadAndAnalyzeImage(imageKey);
    const recognizePlate = await this.alprService.recognizePlate(imageKey);

    return {
      message: 'Image analyzed successfully',
      answer: {...kindImage, recognizePlate},
    } as { message: string; answer: Awaited<T>; };
  }


}