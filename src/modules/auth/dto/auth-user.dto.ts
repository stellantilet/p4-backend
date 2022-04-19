import { IsNotEmpty, IsString } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  signature?: string;
}
