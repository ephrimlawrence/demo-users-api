import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './users.service';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './user.dto';

@ApiTags("Users")
@Controller("api/users")
export class UserController {
  constructor(private readonly appService: UserService) { }

  @ApiResponse({
    description: "Returns all users from the database",
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: "No user was found in the database. Ensure the user exists in the database",
    schema: {
      example:
      {
        statusCode: 404,
        message: "No users found",
        error: "Not Found"
      }
    }
  })
  @ApiBadRequestResponse({
    description: "Invalid user ID. Ensure the user ID is a valid MongoDB ID",
    schema: {
      example:
      {
        statusCode: 400,
        message: "Invalid user ID",
        error: "Bad Request"
      }
    }
  })
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
