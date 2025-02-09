import {Injectable, HttpException, HttpStatus, Inject} from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import * as cheerio from 'cheerio';
import {UploadBodyDto} from './dtos/upload-body.dto';
import {apiConstants} from './constants';
import {Service} from '../enums';
import {IProcessedFileService} from '../processed-file/processed-file.service';
import * as process from 'node:process';

export interface IApiService<T> {
    parseUploadBody(uploadBodyDto: UploadBodyDto): Promise<any>;
}

axiosRetry(axios, {
    retries: 3, // Number of retry attempts after a failed request.
    retryDelay: (retryCount) => {
        return retryCount * 10000; // Delay between retries, increasing exponentially (5s, 10s, 15s).
    },
    retryCondition: (error) => {
        return error.response.status === 429; // Retry only if the response status code is 429 (Too Many Requests).
    },
});

@Injectable()
export class ApiService<T> implements IApiService<T> {
    constructor(
        @Inject(Service.ProcessedFile) private readonly processedFileService: IProcessedFileService<T>,
    ) {

    }

    private async parseUrl(url: string): Promise<any[]> {
            const baseUrl = ApiService.getBaseUrl(url);
            try {
                // Fetch and parse the sitemap
                const sitemapUrls = await this.fetchSitemapUrls(`${baseUrl}/sitemap.xml`);

                // Scrape the categories and products from each sitemap URL
                const products = [];
                for (const sitemapUrl of sitemapUrls) {
                    const productUrls = await this.fetchProductUrlsFromSitemap(sitemapUrl);
                    for (const productUrl of productUrls) {
                        const productData = await this.scrapeProductPage(productUrl);
                        products.push(productData);
                    }
                }

                return products;
            } catch (error) {
                console.log('Error', error);
                throw new HttpException('Failed to parse website', HttpStatus.BAD_REQUEST);
            }
    }

    // Method to extract base URL from full URL
    private static getBaseUrl(url: string): string {
        try {
            const { protocol, host } = new URL(url);
            return `${protocol}//${host}`;
        } catch (error) {
            throw new HttpException('Invalid URL', HttpStatus.BAD_REQUEST);
        }
    }

    private async fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
        const response = await axios.get(sitemapUrl);
        const data = response.data;
        const $ = cheerio.load(data, { xmlMode: true });

        const sitemapUrls = [];
        $('sitemap > loc').each((index, element) => {
            sitemapUrls.push($(element).text());
        });

        return sitemapUrls;
    }

    private async fetchProductUrlsFromSitemap(sitemapUrl: string): Promise<string[]> {
        const response = await axios.get(sitemapUrl);
        const data = response.data;
        const $ = cheerio.load(data, { xmlMode: true });

        const productUrls = [];
        $('url > loc').each((index, element) => {
            productUrls.push($(element).text());
        });

        return productUrls;
    }

    private async scrapeProductPage(productUrl: string): Promise<any> {
        const response = await axios.get(productUrl);
        const data = response.data;
        const $ = cheerio.load(data);

        // Example scraping logic for product data
        const title = $('h1.cs-title').text();
        const price = $('.cs-goods-price__value.cs-goods-price__value_type_current').text();
        const imageUrl = $('.cs-product-gallery__image').attr('src');

        return { title, price, imageUrl };
    }

    private async searchGoogle(text: string): Promise<string> {
        const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(text)}&key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.SEARCH_ENGINE_ID}`;

        try {
            const response = await axios.get(url);
            const results = response.data.items;
            if (results && results.length > 0) {
                // Output URL of the first result from the top 10
                console.log('First URL in top 10:', results[0].link);
                return results[0].link;
            } else {
                console.log('No results found');
                return '';
            }

        } catch (error) {
            throw new HttpException('Failed to search website', HttpStatus.BAD_REQUEST);
        }
    }

    private async parseFile(file: Buffer): Promise<any[]> {
        try {
            return [];
        } catch (error) {
            throw new HttpException('Failed to parse file', HttpStatus.BAD_REQUEST);
        }
    }

    public async parseUploadBody(uploadBodyDto: UploadBodyDto): Promise<any[]> {
        let answerText = [];
        let answerFile = [];
        const {text = '', file, extension = apiConstants.defaultExtensionCSVFile} = uploadBodyDto;

        // text recognition (text or website link)
        const regex = (/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);
        const isUrl = text.match(regex);

        if (isUrl) {
            answerText = await this.parseUrl(text);
        } else if (text) {
            // search url by text
            const searchUrl: string = await this.searchGoogle(text);

            if (!searchUrl) {
                throw new HttpException('URL not found', HttpStatus.BAD_REQUEST);
            }

            answerText = await this.parseUrl(searchUrl);
        }

        if (file.length) {
            answerFile = await this.parseFile(file);
        }

        const parsedData = [...answerText, ...answerFile];

        return this.processedFileService.processedDataToFile(parsedData, extension);
    }
}
