import {
    BadRequestException, Controller, Post, UploadedFile, UseGuards, UseInterceptors,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { v4 as uuid } from 'uuid';
  
  import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
  
  const ALLOWED = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm'];
  
  @ApiTags('uploads')
  @Controller('uploads')
  @UseGuards(JwtAuthGuard)
  export class UploadsController {
    @Post('image')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/images',
          filename: (_req, file, cb) => cb(null, `${uuid()}${extname(file.originalname)}`),
        }),
        fileFilter: (_req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          if (!ALLOWED.includes(ext)) return cb(new BadRequestException('File type not allowed'), false);
          cb(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 }, 
      }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
      if (!file) throw new BadRequestException('File is required');
      return { url: `/uploads/images/${file.filename}`, size: file.size };
    }
  
    @Post('video')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/videos',
          filename: (_req, file, cb) => cb(null, `${uuid()}${extname(file.originalname)}`),
        }),
        limits: { fileSize: 500 * 1024 * 1024 }, 
      }),
    )
    uploadVideo(@UploadedFile() file: Express.Multer.File) {
      if (!file) throw new BadRequestException('File is required');
      return { url: `/uploads/videos/${file.filename}`, size: file.size };
    }
  }