import {Inject, Injectable} from '@nestjs/common';
import * as tf from '@tensorflow/tfjs-node';

import {Service} from '../enums';
import {IAWSService} from '../aws/aws.service';

export interface IAIService<T> {
    uploadFile(file: Express.Multer.File): Promise<{ message: string; answer: Awaited<T>; }>;
}

@Injectable()
export class AIService<T> implements IAIService<T> {
    constructor(
        @Inject(Service.AWS) private readonly awsService: IAWSService<T>,
    ) {

    }

    public async uploadFile(file: Express.Multer.File): Promise<{ message: string; answer: Awaited<T>; }> {
        const result = await this.awsService.uploadAndAnalyzeImage(file);
        return {
            message: 'Image analyzed successfully',
            answer: result,
        } as { message: string; answer: Awaited<T>; };
    }



}