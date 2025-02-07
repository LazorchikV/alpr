import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void {
        console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
        console.log(`Request Body: ${JSON.stringify(req.body)}`);
        console.log(`Request Headers: ${JSON.stringify(req.headers)}`);

        next();
    }
}