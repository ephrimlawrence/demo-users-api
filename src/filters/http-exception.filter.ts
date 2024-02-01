import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * This filter is used to catch all HTTP exceptions and return a standard JSON response to the client.
 * Additionally, the caught exception can be sent to Slack or Sentry for debugging purposes.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // TODO: report 500x errors to sentry

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as unknown as any,
      message = (exceptionResponse as any).message;

    if (status === HttpStatus.BAD_REQUEST) {
      if (message != null) {
        if (message.constructor === Array && message.length > 0) {
          exceptionResponse.message = exceptionResponse.message[0];
          exceptionResponse.errors = exceptionResponse.message;
        }
      }
    }

    // TODO: send error to slack/sentry

    response.status(status).json(exceptionResponse);
  }
}
