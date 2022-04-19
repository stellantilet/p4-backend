import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntitySchema, getConnection, ObjectType } from 'typeorm';

interface UniqueValidationArguments<E> extends ValidationArguments {
  constraints: [
    ObjectType<E> | EntitySchema<E> | string,
    ((validationArguments: ValidationArguments) => any) | keyof E,
    string | string[] | undefined,
  ];
}

export function Unique(
  property: { entity: any; where?: any },
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property.entity, property.where],
      validator: UniqueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  public async validate<E>(value: string, args: UniqueValidationArguments<E>) {
    const [EntityClass, where = args.property] = args.constraints;
    const repository = getConnection().getRepository(EntityClass);
    return (
      (await repository.count({
        where:
          typeof where === 'function'
            ? where(args)
            : {
                [where || args.property]: value,
              },
      })) <= 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [EntityClass] = args.constraints;
    const entity = EntityClass.name || 'Entity';
    return `${entity} with the same '${args.property}' already exist`;
  }
}
