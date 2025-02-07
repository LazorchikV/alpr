import {Injectable} from '@nestjs/common';


export interface IProcessedFileService<T> {
    processedDataToFile(parsedData: any[], requestedFileExtension: string): Promise<any[]>;
}

@Injectable()
export class ProcessedFileService implements IProcessedFileService<any> {
    public async processedDataToFile(parsedData: any[], requestedFileExtension: string): Promise<any[]> {
        if (!parsedData?.length) return [];

        const mappingToProcessFileFromExtension = {
            [FileExtension.XML]: await this.processedXMLFile(parsedData),
            [FileExtension.YML]: await this.processedYMLFile(parsedData),
            [FileExtension.EXCEL]: await this.processedEXCELFile(parsedData),
            [FileExtension.CSV]: await this.processedCSVFile(parsedData),
        };

        return mappingToProcessFileFromExtension[requestedFileExtension];
    }

    private async processedXMLFile(parsedData: any[]): Promise<any[]> {
        return [];
    }
    private async processedYMLFile(parsedData: any[]): Promise<any[]> {
        return [];
    }
    private async processedEXCELFile(parsedData: any[]): Promise<any[]> {
        return [];
    }
    private async processedCSVFile(parsedData: any[]): Promise<any[]> {
        return [];
    }
}