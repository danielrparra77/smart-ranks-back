import { Injectable } from '@nestjs/common';
import { IUser } from '../entity/user.entity';
import { IUserCredentials } from '../entity/user-credentials.entity';

@Injectable()
export abstract class IUserService {
  /**
   * find user by email in database
   * @param email user email
   * @returns user data
   */
  abstract findUserByEmail(email: string): Promise<IUser>;

  /**
   * create user if not exists, otherwise update user data
   * @param user data of user to update
   * @param credentials user login credentials
   * @returns user data
   */
  abstract upsertUser(user: Partial<IUser>, credentials: IUserCredentials): Promise<IUser>;

  /**
   * delete user by email
   * @param email user email
   */
  abstract deleteUser(userEmail: string): Promise<void>;

  /**
   * sign in user with email and password to get JWT
   * @param userEmail email of user
   * @param pass user password
   */
  abstract signIn( userEmail: string, pass: string): Promise<{ access_token: string }>;
}
