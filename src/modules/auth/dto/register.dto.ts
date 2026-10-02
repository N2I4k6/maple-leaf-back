import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin@maple.leaf' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'strongpassword' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'Nikolay' })
  @IsString()
  @MinLength(2)
  name!: string;
}