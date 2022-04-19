import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { ItemAttributeDisplayEnum } from '../../../constants/enums';

export class ItemAttributeDto {
  @IsEnum(ItemAttributeDisplayEnum)
  displayType?: ItemAttributeDisplayEnum;

  @IsString()
  traitType?: string;

  @IsString()
  value?: string;

  @IsNumber()
  itemId?: string;

  @IsNumber()
  rarity?: number;

  @IsNumber()
  id?: number;

  @IsBoolean()
  deleted: boolean;
}

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image?: string;

  @IsUrl()
  externalUrl?: string;

  @IsString()
  description: string;

  @IsHexColor()
  backgroundColor?: string;

  @IsUrl()
  animationUrl?: string;

  @IsUrl()
  youtubeUrl?: string;

  @IsArray()
  attributes: ItemAttributeDto[];

  @IsNumber()
  ownerId: number;
}
