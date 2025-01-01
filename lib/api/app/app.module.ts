import { HealthModule } from '@/lib/api/health/health.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
