import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthUsersController } from './auth-users.controller';
import { AuthUsersService } from './auth-users.service';
import { JwtStrategy } from './users-jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('jwt');
      },
    }),
  ],
  providers: [AuthUsersService, JwtStrategy],
  controllers: [AuthUsersController],
})
export class AuthUsersModule {}
