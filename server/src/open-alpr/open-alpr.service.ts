import { exec } from 'child_process';
import { Injectable } from '@nestjs/common';
import { IRecognition } from '../alpr/interfaces';

export interface IOpenAlprService<T> {
  recognizePlate(imagePath: string): Promise<IRecognition[]>;
}

@Injectable()
export class OpenAlprService<T> implements IOpenAlprService<T> {
  private openAlprPath = 'D:\\openalpr_64\\alpr.exe'; // Path to OpenALPR

  public async recognizePlate(imagePath: string): Promise<IRecognition[]> {
    return new Promise((resolve, reject) => {
      exec(`${this.openAlprPath} -c us ${imagePath}`, (error, stdout) => {
        if (error) {
          console.error('❌ OpenALPR error:', error);
          return reject([{ text: 'Error in recognition' }]);
        }
        console.log('✅ OpenALPR Output:', stdout);

        try {
          const regex = /-\s+(\S+)\s+confidence:\s+([\d.]+)/g;
          let match;
          const results: IRecognition[] = [];

          while ((match = regex.exec(stdout)) !== null) {
            results.push({
              text: match[1],
              confidence: parseFloat(match[2])/100,
            });
          }

          if (!results?.length) {
            resolve([{text: 'OpenALPR - Not Found'}]);
          }

          resolve(results);
        } catch (parseError) {
          reject(parseError);
        }
      });
    });
  }
}
