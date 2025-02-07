import {Controller, Post, Req, Res, Body, HttpStatus, Inject, Get} from '@nestjs/common';
import { Request, Response } from 'express';
import {Resource, Service} from '../enums';
import {UploadBodyDto} from './dtos/upload-body.dto';
import {IApiService} from './api.service';

@Controller(Resource.Api)
export class ApiController {
    constructor(
        @Inject(Service.Api) private readonly apiService: IApiService<any>,
    ) {}

    @Get()
    async handle(
        @Req() req: Request,
        @Res() res: Response,
    ) {
        return res.status(HttpStatus.OK).send({message: 'This page for API'});
    }

    @Post('upload')
    async handleUpload(
        @Req() req: Request,
        @Res() res: Response,
        @Body() uploadBodyDto: UploadBodyDto,
    ) {
        if (!uploadBodyDto.text && !(uploadBodyDto.file).length) {
            throw new Error('Text or file is empty!');
        }

        const answerParsing = await this.apiService.parseUploadBody(uploadBodyDto);
        return res.status(HttpStatus.OK).send({
            message: 'Data processed successfully',
            answerParsing
        });
    }
}
