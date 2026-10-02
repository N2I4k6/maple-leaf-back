import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  title!: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  excerpt!: string;

  @ApiProperty()
  @IsString()
  @MinLength(20)
  content!: string;

  @ApiProperty()
  @IsUrl({ require_tld: false, require_protocol: true })
  coverUrl!: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}