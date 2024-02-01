import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { KindagooseModule } from 'kindagoose';
import { User } from './models/user.model';

@Module({
  imports: [

    //! NOTE: Recommended to use environment variables here. This is just for demonstration purposes.
    KindagooseModule.forRoot('mongodb://localhost:27017', {
      dbName: 'test',
    }),

    KindagooseModule.forFeature([
      User,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
