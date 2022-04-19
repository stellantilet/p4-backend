import { IsNotEmpty, IsString, ValidationArguments } from 'class-validator';
import { Equal, FindOperator, Not } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { Unique } from '../../../validations/unique.validation';

export class CreateUserDto {
  id?: number;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  @Unique({
    entity: User,
    where: (args: ValidationArguments) => {
      const { object } = args;
      const data = object as CreateUserDto;
      const where = { address: data.address } as {
        address: string;
        id?: FindOperator<number>;
      };
      if (data.id) {
        where.id = Not(Equal(data.id));
      }
      return where;
    },
  })
  address: string;
  nounce?: string;
}
