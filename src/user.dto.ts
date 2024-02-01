import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class UserDto {
    @ApiProperty({
        description: "The user's first name",
        required: true,
        example: "John"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    firstName: string;

    @ApiProperty({
        description: "The user's last name",
        required: true,
        example: "Doe"
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(2)
    lastName: string;

    @ApiProperty({
        description: "The user's email address. Must be unique for each user",
        required: true,
        example: "jandoe@example.com",
        uniqueItems: true,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "The date and time the user was created",
        required: true,
        example: "2021-01-01T00:00:00.000Z",
    })
    createdAt: Date;

    @ApiProperty({
        description: "The date and time the user was last updated",
        required: true,
        example: "2021-01-01T00:00:00.000Z",
    })
    updatedAt: Date;
}


export class UserResponseDto {
    @ApiProperty({
        description: "The HTTP status code",
        required: true,
        example: 200,
    })
    statusCode: number;

    @ApiProperty({
        description: "The user's data. To make the response consistent, this is always an array, even if only one user is returned",
        required: true,
        isArray: true,
        type: UserDto,
    })
    data: UserDto[]
}
