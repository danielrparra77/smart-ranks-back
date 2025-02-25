import { Test, TestingModule } from '@nestjs/testing';
import { IUserService } from '../user.service';
import { UserService } from './user.service.impl';
import { JestMockedClass } from '../../../../test/types/types';
import { IUserProvider } from '../../../data-provider/user/user.provider';
import { User } from '../../../schema/user.schema';
import { userMock } from '../../../../test/mock/user.mock';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { RoleEnum } from '../../../common/enum/role.enum';
import { IUserCredentials } from '../../entity/user-credentials.entity';

describe('UserService', () => {
  let mockData: User;
  const userProvider: JestMockedClass<IUserProvider> = {
    findUserByEmail: jest.fn(),
    upsertUser: jest.fn(),
    deleteUser: jest.fn(),
  };
  const mockJwtService: Partial<JwtService> = {
    signAsync: jest.fn().mockResolvedValue('token'),
  }

  let orderService: IUserService;
  let userPProvider: IUserProvider;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserService,
          useClass: UserService,
        },
        {
          provide: IUserProvider,
          useValue: userProvider,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        }
      ],
    }).compile();

    orderService = app.get<IUserService>(IUserService);
    userPProvider = app.get<IUserProvider>(IUserProvider);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(userPProvider).toBeDefined();
  });

  beforeEach(()=>{
    mockData = User.build(userMock);
  })

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByEmail');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.findUserByEmail(mockData.email)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertUser', () => {
    mockData = User.build(userMock);
    const credentials: IUserCredentials = {
      id: mockData.id,
      email: mockData.email,
      role: mockData.role,
    };
  
    it('should upsert user data for admin', async () => {
      mockData.role = RoleEnum.administrator;
      credentials.role = RoleEnum.administrator;
      const spy = jest.spyOn(userPProvider, 'upsertUser');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.upsertUser(mockData, credentials)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  
    it('should upsert user data for user', async () => {
      mockData.role = RoleEnum.user;
      credentials.role = RoleEnum.user;
      const spy = jest.spyOn(userPProvider, 'upsertUser');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.upsertUser(mockData, credentials)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  
    it('should not upsert user data for another user', async () => {
      mockData.role = RoleEnum.user;
      mockData.email = 'otrocorreo@correo.com';
      credentials.role = RoleEnum.user;
      const spy = jest.spyOn(userPProvider, 'upsertUser');
      spy.mockResolvedValueOnce(mockData);
      await expect(orderService.upsertUser(mockData, credentials)).rejects.toEqual(new UnauthorizedException());
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });

  describe('deleteUser', () => {
    it('should upsert user data', async () => {
      const spy = jest.spyOn(userPProvider, 'deleteUser');
      await orderService.deleteUser(mockData.email);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('signIn', () => {
    it('should allow credentials', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByEmail');
      spy.mockResolvedValueOnce(mockData);
      const spyJWT = jest.spyOn(userPProvider, 'findUserByEmail');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.signIn(mockData.email, mockData.password)).toEqual({access_token: 'token'});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyJWT).toHaveBeenCalledTimes(1);
    });
  
    it('should not allow credentials', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByEmail');
      spy.mockResolvedValueOnce(mockData);
      const spyJWT = jest.spyOn(userPProvider, 'findUserByEmail');
      spy.mockResolvedValueOnce(mockData);
      await expect(orderService.signIn(mockData.email, 'incorrecto')).rejects.toEqual(new UnauthorizedException());
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyJWT).toHaveBeenCalledTimes(1);
    });
  });
});
