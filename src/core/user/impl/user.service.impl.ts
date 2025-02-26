import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUserService } from '../user.service';
import { IUserProvider } from '../../../data-provider/user/user.provider';
import { IUser } from '../../entity/user.entity';
import { RoleEnum } from '../../../common/enum/role.enum';
import { JwtService } from '@nestjs/jwt';
import { IUserCredentials } from '../../entity/user-credentials.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userProvider: IUserProvider,
    private jwtService: JwtService,
  ) {}

  async findUsers(): Promise<IUser[]> {
    const usersModel = await this.userProvider.findUsers();
    return usersModel as IUser[];
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const userModel = await this.userProvider.findUserByEmail(email);
    return userModel as IUser;
  }

  async upsertUser(user: Partial<IUser>, credentials: IUserCredentials): Promise<IUser> {
    if (!user.role) user.role = RoleEnum.user;
    if (credentials.role == RoleEnum.user)
      delete user.role;
    if (credentials.role == RoleEnum.user && user.email !== credentials.email)
      throw new UnauthorizedException();
    const userModel = await this.userProvider.upsertUser(user);
    return userModel as IUser;
  }

  async deleteUser(userEmail: string): Promise<void> {
    await this.userProvider.deleteUser(userEmail);
  }

  async signIn(userEmail: string, pass: string): Promise<{ access_token: string; role: RoleEnum; }> {
    const user = await this.findUserByEmail(userEmail);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, id: user.id, role: user.role } as IUserCredentials;
    return {
      access_token: await this.jwtService.signAsync(payload),
      role: user.role
    };
  }
}
