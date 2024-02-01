import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

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
  async getUser(
    @Param("userId") userId: string
  ): Promise<UserResponseDto> {
    return this.appService.getUser(userId)
      .then((user) => {
        const resp = new UserResponseDto();
        resp.statusCode = 200;
        resp.data = [user];

        return resp;
      });
  }
}
