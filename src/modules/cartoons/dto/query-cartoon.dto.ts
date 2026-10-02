import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class QueryCartoonDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Поиск по названию' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Фильтр по жанру' })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiPropertyOptional({ description: 'Год выпуска' })
  @IsString()
  @IsOptional()
  year?: string;
}