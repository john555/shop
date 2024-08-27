export const toPascalCase = (str: string) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

export const toUpperSnakeCase = (str: string) => {
  return str
    .split('-')
    .map((word) => word.toUpperCase())
    .join('_');
};

export const toLowerSnakeCase = (str: string) => {
  return str
    .split('-')
    .map((word) => word.toLowerCase())
    .join('_');
};

export const toCamelCase = (str: string) => {
  return str
    .split('-')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
};
