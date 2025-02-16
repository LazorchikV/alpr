import { Inject, Injectable } from '@nestjs/common';

import { Service } from '../enums';
import { IAWSService } from '../aws/aws.service';
import { IAlprService } from '../alpr/alpr.service';
import { IRecognition } from '../alpr/interfaces';

export interface IAIService<T> {
  uploadFile(file: Express.Multer.File): Promise<Partial<T> & {
    imageUrl: string;
    recognizedPlate: IRecognition[],
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
    recognizedPlate: IRecognition[],
  }> {
    const imageKey = await this.awsService.uploadToS3(file);
    const imageUrl = await this.awsService.getImageUrl(imageKey);
    const confidenceLevels: any = await this.awsService.uploadAndAnalyzeImage(imageKey);

    if (!confidenceLevels?.Labels?.some(label => label.Name === 'License Plate')) {
      return {
        ...confidenceLevels,
        imageUrl,
        recognizedPlate: [{text: 'License Plate not found', boundingBox: { x: 0, y: 0, width: 0, height: 0 } }]
      };
    }

    const {recognizedPlate} = await this.alprService.recognizePlate(imageKey);
    return {...confidenceLevels, imageUrl, recognizedPlate};
  }
}