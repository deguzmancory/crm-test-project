import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength, IsEnum, IsArray, IsOptional } from 'class-validator';
import { RoleType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'john123' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: [RoleType.ADMIN, RoleType.SALES_REP], enum: RoleType, isArray: true })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleType, { each: true })
  roles?: RoleType[];
}
