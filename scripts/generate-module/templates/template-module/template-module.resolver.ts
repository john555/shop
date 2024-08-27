import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { TemplateModule } from './template-module.entity';
import { TemplateModuleService } from './template-module.service';
import {
  TemplateModuleCreateInput,
  TemplateModuleUpdateInput,
} from './template-module.dto';
import { PaginationArgs } from '@api/pagination/pagination.args';

@Resolver(() => TemplateModule)
export class TemplateModuleResolver {
  constructor(private readonly templateModuleService: TemplateModuleService) {}

  @Query(() => TemplateModule!)
  async templateModule(@Args('id') id: string): Promise<TemplateModule> {
    const templateModule =
      await this.templateModuleService.getTemplateModuleById(id);
    if (!templateModule) {
      throw new NotFoundException('TemplateModule not found');
    }
    return templateModule;
  }

  @Query(() => [TemplateModule!])
  async templateModules(
    @Args() args: PaginationArgs,
  ): Promise<TemplateModule[]> {
    return this.templateModuleService.getTemplateModules(args);
  }

  @Mutation(() => TemplateModule)
  async createTemplateModule(
    @Args('input') input: TemplateModuleCreateInput,
  ): Promise<TemplateModule> {
    return this.templateModuleService.create(input);
  }

  @Mutation(() => TemplateModule)
  async updateTemplateModule(
    @Args('input') input: TemplateModuleUpdateInput,
  ): Promise<TemplateModule> {
    let templateModule: TemplateModule;
    try {
      templateModule = await this.templateModuleService.update(input);
      return templateModule;
    } catch (error) {
      if (!templateModule) {
        throw new NotFoundException(
          `TemplateModule with id=${input.id} not found`,
        );
      }
    }
  }
}
