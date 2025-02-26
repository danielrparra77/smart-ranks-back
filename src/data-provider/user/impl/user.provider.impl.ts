import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IUserProvider } from '../user.provider';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../../schema/user.schema';
import { IUser } from '../../../core/entity/user.entity';
import { RoleEnum } from '../../../common/enum/role.enum';

@Injectable()
export class UserProvider implements IUserProvider {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findUsers(): Promise<User[]> {
    return await this.userModel.find({role: RoleEnum.user}, {password: false});
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({email});
  }

  async upsertUser(user: Partial<IUser>): Promise<User> {
    const userUpdated = await this.userModel.findOneAndUpdate({email: user.email}, { $set: user }, {upsert: true});
    return User.build(userUpdated);
  }

  async deleteUser(userEmail: string): Promise<void> {
    await this.userModel.findOneAndDelete({email: userEmail});
  }
}
