import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { User } from './user.schema';
import { Product } from './product.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ 
    required: true,
    default: function genUUID() {
      return uuidv4();
    }
  })
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];

  @Prop({ required: true })
  total: number;

  @Prop({ required: true })
  date: Date;

  static build (InvoiceData): Invoice {
    return plainToInstance(Invoice, InvoiceData);
  }
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);