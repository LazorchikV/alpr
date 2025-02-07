import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3Client, PutObjectCommand, GetObjectCommand} from '@aws-sdk/client-s3';
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { SageMakerRuntimeClient, InvokeEndpointCommand } from '@aws-sdk/client-sagemaker-runtime';

export interface IAWSService<T> {
    uploadAndAnalyzeImage(file: Express.Multer.File): Promise<Partial<T>>;
}

@Injectable()
export class AWSService<T> implements IAWSService<T>{
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

    public async uploadAndAnalyzeImage(file: Express.Multer.File): Promise<Partial<T>> {
        // Загрузка файла в S3
        const imageKey = await this.uploadToS3(file);

        // Анализ изображения с использованием Rekognition
        const analysisResult = await this.analyzeImageWithSageMaker(imageKey) // await this.analyzeImageWithRekognition(imageKey);

        // Возвращаем результат анализа
        return analysisResult as Partial<T>;
    }

    async uploadToS3(file: Express.Multer.File): Promise<string> {
        const key = `${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        // Загружаем файл в S3
        const command = new PutObjectCommand(params);
        await this.s3Client.send(command);

        return key; // Возвращаем ключ файла
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
        // Получаем объект из S3
        const getObjectParams = {
            Bucket: this.bucketName,
            Key: s3Key,
        };
        const getObjectCommand = new GetObjectCommand(getObjectParams);
        const s3Object = await this.s3Client.send(getObjectCommand);

        // Преобразуем данные в base64
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

    // Преобразование потока в строку
    private async streamToString(stream: NodeJS.ReadableStream): Promise<string> {
        return new Promise((resolve, reject) => {
            const chunks: Uint8Array[] = [];
            stream.on('data', (chunk) => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
            stream.on('error', reject);
        });
    }
}
