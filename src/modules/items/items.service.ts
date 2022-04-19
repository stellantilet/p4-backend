import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { ItemAttribute } from '../../entities/item-attribute.entity';
import { Item } from '../../entities/item.entity';
import { PaginationService } from '../../pagination/pagination.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService extends PaginationService {
  constructor(
    @InjectRepository(Item)
    private repository: Repository<Item>,

    @InjectRepository(ItemAttribute)
    private attributeRepository: Repository<ItemAttribute>,
  ) {
    super();
  }

  getRepository(): Repository<ObjectLiteral> {
    return this.repository;
  }

  async create(data: CreateItemDto): Promise<Item> {
    const { attributes: attributesDto, ...rest } = data;
    const itemData = {
      ...rest,
    };
    const ret = this.repository.create(itemData);
    const item = await this.repository.save(ret);

    await Promise.all(
      attributesDto.map(async (attribute) => {
        attribute.itemId = item.id;
        const data = this.attributeRepository.create(attribute);
        return await this.attributeRepository.save(data);
      }),
    );
    const itemRet = await this.repository.findOne({
      where: { id: item.id },
      relations: ['attributes'],
    });
    return itemRet;
  }

  findOne(id: string): Promise<Item> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: UpdateItemDto) {
    const { attributes: attributesDto, ...rest } = data;
    const itemData = {
      ...rest,
    };
    await this.repository.update(id, itemData);
    await Promise.all(
      attributesDto.map(async (attributeDto) => {
        if (attributeDto.id) {
          if (attributeDto.deleted) {
            return await this.attributeRepository.delete(attributeDto.id);
          }
          const { id, ...rest } = attributeDto;
          return await this.attributeRepository.update(id, rest);
        }
        attributeDto.itemId = id;
        const attribute = this.attributeRepository.create(attributeDto);
        return await this.attributeRepository.save(attribute);
      }),
    );
    const itemRet = await this.repository.findOne({
      where: { id },
      relations: ['attributes'],
    });
    this.repository.save(itemRet, { reload: true });
    return itemRet;
  }

  async destroy(id: string) {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
