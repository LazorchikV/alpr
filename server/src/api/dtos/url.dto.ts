import {IsNotEmpty, IsString, Matches} from 'class-validator';

export class UrlDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, {
        message: 'Link must be a valid URL: https://sitename.domain'
    })
    url: string;
}