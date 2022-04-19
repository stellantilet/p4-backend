/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import * as ethUtil from 'ethereumjs-util';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthUserDto } from './dto/auth-user.dto';

export interface JwtPayload {
  address: string;
}

@Injectable()
export class AuthUsersService {
  constructor(private usersService: UsersService) {}

  validateAddress(address: string): Promise<User> {
    return this.usersService.findOneByAddress(address);
  }

  async signup(data: AuthUserDto): Promise<User> {
    let user = await this.usersService.findOneByAddress(data.address);
    if (!user) {
      const { signature, ...dto } = data;
      user = await this.usersService.create({ ...dto });
    }
    const nounce = `${Math.floor(Math.random() * 10000)}`;
    user = await this.usersService.update(user.id, { nounce });
    return user;
  }

  async signin(address: string, signature: string): Promise<User> {
    const user = await this.usersService.findOneByAddress(address);

    if (!user) {
      return null;
    }

    const msg = user.nounce;
    const msgBuffer = ethUtil.toBuffer(msg);
    const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
    const signatureParams = ethUtil.fromRpcSig(signature);
    const publicKey = ethUtil.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s,
    );

    const walletAddressBuffer = ethUtil.publicToAddress(publicKey);
    const walletAddress = ethUtil.bufferToHex(walletAddressBuffer);

    if (walletAddress.toLowerCase() === address.toLocaleLowerCase()) {
      return user;
    }

    return null;
  }
}
