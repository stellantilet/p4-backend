import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PaginationService } from '../../pagination/pagination.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService extends PaginationService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {
    super();
  }

  getRepository(): Repository<ObjectLiteral> {
    return this.repository;
  }

  async create(data: CreateUserDto): Promise<User> {
    const userData = this.repository.create(data);
    const user = await this.repository.save(userData);
    return user;
  }

  findOne(id: number): Promise<User> {
    return this.repository.findOne({ where: { id } });
  }

  findOneByAddress(address: string): Promise<User> {
    return this.repository.findOne({
      where: { address },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    await this.repository.update(id, data);
    return await this.findOne(id);
  }

  async destroy(id: number) {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
