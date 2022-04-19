import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const UnprocessibleEntityExceptionFactory = (
  errors: ValidationError[],
) => {
  const message = {};
  errors.forEach((value) => {
    const { constraints } = value;
    const constraintKeys = Object.keys(constraints);
    message[value.property] = constraintKeys.map((key) => constraints[key]);
  });
  const res = {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    message,
  };
  return new HttpException(res, HttpStatus.UNPROCESSABLE_ENTITY);
};
