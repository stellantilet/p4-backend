import { ItemAttributeDisplayEnum } from '../constants/enums';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('items_attributes')
export class ItemAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  displayType: ItemAttributeDisplayEnum;

  @Column()
  traitType: string;

  @Column()
  value: string;

  @ManyToOne(() => Item, (item) => item.attributes)
  item: Item;

  @Column()
  itemId: string;

  @Column({ default: 1 })
  rank: number;
}
