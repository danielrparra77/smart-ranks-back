import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusEnum } from '../common/enum/status.enum';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ 
    required: true,
    default: function genUUID() {
      return uuidv4();
    }
  })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true, enum: StatusEnum })
  status: StatusEnum;

  static build (ProductData): Product {
    return plainToInstance(Product, ProductData);
  }
}

export const ProductSchema = SchemaFactory.createForClass(Product);