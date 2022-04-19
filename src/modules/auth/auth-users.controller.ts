import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUsersService } from './auth-users.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthUsersController {
  constructor(
    private readonly authUsersService: AuthUsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() data: AuthUserDto) {
    const user = await this.authUsersService.signup(data);
    return user;
  }

  @Post('signin')
  async signin(@Body() data: AuthUserDto) {
    const user = await this.authUsersService.signin(
      data.address,
      data.signature,
    );
    if (!user) {
      throw new HttpException(
        'Username or password is invalid',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = this.jwtService.sign(user);
    return {
      token,
      user,
    };
  }
}
