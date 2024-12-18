import { Module } from '@nestjs/common';
import { MediaResolver } from './media.resolver';
import { MediaService } from './media.service';
import { UploadService } from './upload.service';
import { MediaOptimizationService } from './mediaoptimization.service';

@Module({
  providers: [MediaResolver, MediaService, UploadService, MediaOptimizationService],
  exports: [MediaService],
})
export class MediaModule {}
