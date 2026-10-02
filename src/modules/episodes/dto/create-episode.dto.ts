import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsInt, IsMongoId, IsOptional, IsString,
  IsUrl, Min, MinLength,
} from 'class-validator';

export class CreateEpisodeDto {
  @ApiProperty()
  @IsMongoId()
  seasonId!: string;

  @ApiProperty()
  @IsMongoId()
  cartoonId!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  number!: number;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  title!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUrl({ require_tld: false, require_protocol: true })
  thumbnailUrl!: string;

  @ApiProperty()
  @IsUrl({ require_tld: false, require_protocol: true })
  videoUrl!: string;

  @ApiProperty({ example: 1320 })
  @IsInt()
  @Min(0)
  duration!: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  voiceoverIds?: string[];
}