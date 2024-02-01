import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    logger = new Logger('HTTP');

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;

        res.on('finish', () => {
            const statusCode = res.statusCode;
            const timestamp = new Date().toISOString();
            this.logger.debug(`[${timestamp}]: (${method}) ${originalUrl} ${statusCode}`);
        });

        if (next) {
            next();
        }
    }
}
