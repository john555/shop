import { TemplateModule } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  TemplateModuleCreateInput,
  TemplateModuleUpdateInput,
} from './template-module.dto';
import { PrismaService } from '@/lib/common/prisma/prisma.service';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { paginate } from '@/lib/common/backend/pagination/paginate';

@Injectable()
export class TemplateModuleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTemplateModuleById(id: string): Promise<TemplateModule> {
    return this.prismaService.templateModule.findUnique({
      where: { id },
    });
  }

  async getTemplateModules(args: PaginationArgs): Promise<TemplateModule[]> {
    return paginate({ modelDelegate: this.prismaService.templateModule, args });
  }

  async create(input: TemplateModuleCreateInput): Promise<TemplateModule> {
    return this.prismaService.templateModule.create({
      data: {
        ...input,
      },
    });
  }

  async update(input: TemplateModuleUpdateInput): Promise<TemplateModule> {
    return this.prismaService.templateModule.update({
      where: { id: input.id },
      data: {
        ...input,
      },
    });
  }
}
