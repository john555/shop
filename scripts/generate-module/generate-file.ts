import { mkdirSync, readFileSync, writeFile } from 'fs';
import { join } from 'path';
import {
  toCamelCase,
  toLowerSnakeCase,
  toPascalCase,
  toUpperSnakeCase,
} from '../utils/strings';

export enum FileTypes {
  DTO = 'dto',
  ENTITY = 'entity',
  MODULE = 'module',
  RESOLVER = 'resolver',
  SERVICE = 'service',
}

type GenerateFileOptions = {
  type: FileTypes;
  name: string;
  path: string;
};

export const generateFile = (options: GenerateFileOptions) => {
  return new Promise((resolve, reject) => {
    const { name, path } = options;
    const modulePath = `${path}/${name}`;
    const moduleFileName = `${name}.${options.type}.ts`;

    let moduleContent = readFileSync(
      join(
        __dirname,
        'templates',
        'template-module',
        `template-module.${options.type}.ts`,
      ),
      'utf-8',
    );

    // Update imports
    moduleContent = moduleContent.replace(/template-module\./g, `${name}.`);

    // Update class names
    moduleContent = moduleContent.replace(
      /TemplateModule/g,
      toPascalCase(name),
    );

    // Update constants
    moduleContent = moduleContent.replace(
      /TEMPLATE_MODULE/g,
      toUpperSnakeCase(name),
    );

    // Update variables
    moduleContent = moduleContent.replace(/templateModule/g, toCamelCase(name));

    // Update table names
    moduleContent = moduleContent.replace(
      /template_module/g,
      toLowerSnakeCase(name),
    );

    mkdirSync(modulePath, { recursive: true });

    writeFile(
      `${modulePath}/${moduleFileName}`,
      moduleContent,
      { flag: 'w' },
      (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(`${modulePath}/${moduleFileName}`);
      },
    );
  });
};
