import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleEnum } from '../common/enum/role.enum';
import { v4 as uuidv4 } from 'uuid';
import { plainToInstance } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ 
    required: true,
    default: function genUUID() {
      return uuidv4();
    }
  })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: RoleEnum })
  role: RoleEnum;

  static build (userData): User {
    return plainToInstance(User, userData);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);