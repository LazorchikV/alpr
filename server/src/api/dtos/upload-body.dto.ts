import {IsString, ValidateNested, IsOptional, IsNotEmpty, Matches} from 'class-validator';
import { Type } from 'class-transformer';

export class UploadBodyDto {
    @IsString()
    @IsNotEmpty()
    permissions: string;

    @IsString()
    @IsOptional()
    text?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => Buffer)
    file?: Buffer;

    @IsOptional()
    extension?: string;
}
