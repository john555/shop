import { Module } from '@nestjs/common';
import { TemplateModuleResolver } from './template-module.resolver';
import { TemplateModuleService } from './template-module.service';

@Module({
  imports: [],
  providers: [TemplateModuleResolver, TemplateModuleService],
})
export class TemplateModuleModule {}
