import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags("Users")
@Controller("api/users")
export class UserController {
  constructor(private readonly appService: UserService) { }

  @ApiParam({
    name: "userId",
    type: String,
    required: true,
    description: "The ID of the user to retrieve from the database"
  })
  @Get(":userId")
  getUser(
    @Param("userId") userId: string
  ): string {
    return this.appService.getHello();
  }
}
