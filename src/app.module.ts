import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { KindagooseModule } from 'kindagoose';
import { User } from './models/user.model';

@Module({
  imports: [
    KindagooseModule.forFeature([
      User,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
