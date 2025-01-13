import { Module } from '@nestjs/common';
import { TagResolver } from './tag.resolver';
import { TagService } from './tag.service';
import { StoreModule } from '@/lib/admin-api/store/store.module';

@Module({
  imports: [StoreModule],
  providers: [TagResolver, TagService],
  exports: [TagService],
})
export class TagModule {}
