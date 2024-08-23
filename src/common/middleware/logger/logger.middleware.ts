import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Middleware');
  use(req: Request, res: Response, next: () => void) {
    this.logger.debug(
      `Request|Method:[${req.method}]|Path:[${req.originalUrl}]|IP:[${req.ip}]`,
    );
    next();
  }
}
