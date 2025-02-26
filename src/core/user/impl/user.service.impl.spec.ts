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
    findUsers: jest.fn(),
    findUserByFilter: jest.fn(),
    upsertUser: jest.fn(),
    deleteUser: jest.fn(),
  };
  const mockJwtService: Partial<JwtService> = {
    signAsync: jest.fn().mockResolvedValue('token'),
  }
  const mockCredentialData = User.build(userMock);
  let credentials: IUserCredentials = {
    id: mockCredentialData.id,
    email: mockCredentialData.email,
    role: mockCredentialData.role,
  };

  let orderService: IUserService;
  let userPProvider: IUserProvider;
  let jwtService: JwtService;

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
    jwtService = app.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(userPProvider).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  beforeEach(()=>{
    mockData = User.build(userMock);
  })

  afterEach(()=>{
    credentials = {
      id: mockCredentialData.id,
      email: mockCredentialData.email,
      role: mockCredentialData.role,
    };
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    it('should find users', async () => {
      const spy = jest.spyOn(userPProvider, 'findUsers');
      spy.mockResolvedValueOnce([mockData]);
      expect(await orderService.findUsers()).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserByFilter', () => {
    it('should find user by email', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.findUserByFilter({email: mockData.email})).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertUser', () => {
  
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
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      const spyJWT = jest.spyOn(jwtService, 'signAsync');
      expect(await orderService.signIn(mockData.email, mockData.password)).toEqual({access_token: 'token', role: mockData.role});
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyJWT).toHaveBeenCalledTimes(1);
    });
  
    it('should not allow credentials', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      const spyJWT = jest.spyOn(jwtService, 'signAsync');
      await expect(orderService.signIn(mockData.email, 'incorrecto')).rejects.toEqual(new UnauthorizedException());
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyJWT).toHaveBeenCalledTimes(0);
    });
  });

  describe('findUserData', () => {
    it('should allow userData to administrator', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      credentials.role = RoleEnum.administrator;
      expect(await orderService.findUserData({id: 'dsfgdfg'}, credentials)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should allow userData to user with its own data', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      credentials.role = RoleEnum.user;
      credentials.email = mockData.email;
      expect(await orderService.findUserData({id: 'dsfgdfg'}, credentials)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should throw userData to user with another data', async () => {
      const spy = jest.spyOn(userPProvider, 'findUserByFilter');
      spy.mockResolvedValueOnce(mockData);
      credentials.role = RoleEnum.user;
      credentials.email = 'tro@otro.com';
      await expect(orderService.findUserData({id: 'dsfgdfg'}, credentials)).rejects.toEqual(new UnauthorizedException());
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
