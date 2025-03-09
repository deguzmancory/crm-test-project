import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'test@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (plain text)' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'ADMIN', description: 'User role' })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ example: 'john123', description: 'Unique username' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsNotEmpty()
  lastName: string;
}