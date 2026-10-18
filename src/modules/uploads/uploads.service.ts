import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Bucket } from '@upstash/blob';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadsService {
  private bucket: Bucket;

  constructor() {
    this.bucket = Bucket.fromEnv();
  }

  async uploadFile(file: Express.Multer.File, folder: 'images' | 'videos'): Promise<{ url: string; size: number }> {
    const ext = extname(file.originalname).toLowerCase();
    const key = `${folder}/${uuid()}${ext}`;

    try {
      const blob = await this.bucket.put(key, file.buffer, {
        contentType: file.mimetype,
      });

      if (!blob.url) {
        throw new InternalServerErrorException('Public URL is undefined. Is the bucket public?');
      }

      return {
        url: blob.url,
        size: file.size,
      };
    } catch (error) {
      console.error('Upstash upload error:', error);
      throw new InternalServerErrorException('Upload to storage failed');
    }
  }
}