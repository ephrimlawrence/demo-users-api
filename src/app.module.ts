import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { KindagooseModule } from 'kindagoose';
import { User } from './models/user.model';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    // Configure the ThrottlerModule for the entire application, with a limit of 10 requests per minute
    ThrottlerModule.forRoot([{
      ttl: 60 * 1000, // 1 minute
      limit: 10,
    }]),

    //! NOTE: Recommended to use environment variables here. This is just for demonstration purposes.
    KindagooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'test',
    }),

    KindagooseModule.forFeature([
      User,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,


    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },

    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
