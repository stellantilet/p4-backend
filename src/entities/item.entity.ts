import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ItemAttribute } from './item-attribute.entity';

@Entity('items')
export class Item {
  @PrimaryColumn({ default: '0' })
  id: string;

  @Column()
  name: string;

  @Column({ default: '' })
  image: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  backgroundColor: string;

  @Column({ nullable: true })
  animationUrl: string;

  @Column({ nullable: true })
  youtubeUrl: string;

  @OneToMany(() => ItemAttribute, (attribute) => attribute.item)
  attributes: ItemAttribute[];

  @Column({ nullable: true })
  rarity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
