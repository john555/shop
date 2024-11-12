import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

type CuidValidationTarget = 'all' | 'optional' | 'required';

@ValidatorConstraint({ name: 'isCuid', async: false })
export class IsCuidConstraint implements ValidatorConstraintInterface {
  private isCuidString(value: any): boolean {
    return typeof value === 'string' && /^c[a-z0-9]{24}$/.test(value);
  }

  validate(value: any, args: ValidationArguments) {
    const [target] = args.constraints;
    const options = args.constraints[1] as ValidationOptions;

    // Handle array validation if 'each' is true
    if (options?.each && Array.isArray(value)) {
      if (target === 'optional') {
        return value.every(
          (item) =>
            item === null || item === undefined || this.isCuidString(item)
        );
      }
      return value.every((item) => this.isCuidString(item));
    }

    // Handle single value validation
    if (target === 'optional' && (value === null || value === undefined)) {
      return true;
    }

    return this.isCuidString(value);
  }

  defaultMessage(args: ValidationArguments) {
    const [target] = args.constraints;
    const options = args.constraints[1] as ValidationOptions;

    if (options?.each) {
      return `Each value in ${args.property} must be a valid CUID`;
    }
    return `${args.property} must be a valid CUID`;
  }
}

// Type-safe interface for CUID validation options
export interface CuidValidationOptions extends ValidationOptions {
  each?: boolean;
}

export function IsCuid(
  target: CuidValidationTarget = 'required',
  validationOptions?: CuidValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCuid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [target, validationOptions],
      validator: IsCuidConstraint,
    });
  };
}
