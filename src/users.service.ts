import { Injectable } from '@nestjs/common';
import { InjectModel } from "kindagoose";
import { ReturnModelType } from "@typegoose/typegoose";
import { User } from './models/user.model';
import { isMongoId } from 'class-validator';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>,
  ) { }

  async getUser(id: string): Promise<User> {
    if (!isMongoId(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.userModel.findById(id);

    if (user == null) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
