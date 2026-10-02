import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsMongoId, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateSeasonDto {
  @ApiProperty()
  @IsMongoId()
  cartoonId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  number!: number;

  @ApiProperty({ example: 'Сезон 1' })
  @IsString()
  @MinLength(2)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  posterUrl?: string;
}