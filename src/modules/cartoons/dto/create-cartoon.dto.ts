import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsInt, IsNumber, IsOptional, IsString,
  IsUrl, Max, Min, MinLength,
} from 'class-validator';

export class CreateCartoonDto {
  @ApiProperty({ example: 'Кленовый лес' })
  @IsString()
  @MinLength(2)
  title!: string;

  @ApiProperty({ example: 'Приключения лесных жителей...' })
  @IsString()
  @MinLength(10)
  description!: string;

  @ApiProperty({ example: 8.7 })
  @IsNumber()
  @Min(0)
  @Max(10)
  rating!: number;

  @ApiProperty({ example: 'https://cdn.maple.leaf/posters/1.jpg' })
  @IsUrl({ require_tld: false, require_protocol: true })
  posterUrl!: string;

  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(1950)
  @Max(2100)
  year!: number;

  @ApiProperty({ example: ['Приключения', 'Фэнтези'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  genres?: string[];

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}