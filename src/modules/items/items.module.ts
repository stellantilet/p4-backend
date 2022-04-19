import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemAttribute } from '../../entities/item-attribute.entity';
import { Item } from '../../entities/item.entity';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemAttribute])],
  exports: [TypeOrmModule],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
