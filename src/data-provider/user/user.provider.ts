import { Injectable } from '@nestjs/common';
import { User } from '../../schema/user.schema';
import { IUser } from '../../core/entity/user.entity';

@Injectable()
export abstract class IUserProvider {
  /**
   * find all users
   * @returns user data
   */
  abstract findUsers(): Promise<User[]>;

  /**
   * find user by filter in database
   * @param filter user filter
   * @returns user data
   */
  abstract findUserByFilter(filter: Partial<IUser>): Promise<User | null>;

  /**
   * create user if not exists, otherwise update user data
   * @param user data of user to update
   * @returns user data
   */
  abstract upsertUser(user: Partial<IUser>): Promise<User>;

  /**
   * delte user by email
   * @param email user email
   */
  abstract deleteUser(userEmail: string): Promise<void>;
}
