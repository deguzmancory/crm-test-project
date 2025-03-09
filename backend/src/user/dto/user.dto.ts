import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';

// ✅ Define a TypeScript Enum
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min. 6 characters)' })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'USER', enum: UserRole, description: 'User role' })
  @IsEnum(UserRole) // ✅ Correct usage
  @IsNotEmpty()
  role: UserRole;
}
