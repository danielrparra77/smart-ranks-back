import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { UserController } from './user.controller';
import { IUserService } from '../../core/user/user.service';
import { JestMockedClass } from '../../../test/types/types';
import { User } from '../../schema/user.schema';
import { userMock } from '../../../test/mock/user.mock';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user/user.dto';
import { UserDeleteDto } from '../dto/user/user-delete.dto';
import { UseFilterrDto } from '../dto/user/user.filter-dto';

describe('UserController', () => {
  const mockData = User.build(userMock);
  const mockDataDTO = plainToInstance(UserDto, userMock);
  const userService: Partial<JestMockedClass<IUserService>> = {
    findUsers: jest.fn(),
    findUserData: jest.fn(),
    signIn: jest.fn(),
    upsertUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  let userController: UserController;
  let provider: IUserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{
        provide: IUserService,
        useValue: userService,
      }],
    })
    .compile();

    userController = app.get<UserController>(UserController);
    provider = app.get<IUserService>(IUserService);
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('signIn', () => {
    const token = {access_token: 'token', role: mockData.role};
    it('should sign in user', async () => {
      const spy = jest.spyOn(provider, 'signIn');
      spy.mockResolvedValueOnce(token);
      expect(await userController.signIn({email: mockData.email, password: mockData.password})).toEqual(token);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUsers', () => {
    it('should get users', async () => {
      const spy = jest.spyOn(provider, 'findUsers');
      spy.mockResolvedValueOnce([mockData]);
      expect(await userController.getUsers()).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUser', () => {
    const mockRequest: Partial<Request> = {userData: {}} as any;
    const request = plainToInstance(UseFilterrDto, {_id:'3243535'});
    it('should get user by filter', async () => {
      const spy = jest.spyOn(provider, 'findUserData');
      spy.mockResolvedValueOnce(mockData);
      expect(await userController.getUser(request, mockRequest as any)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertUser', () => {
    const mockRequest: Partial<Request> = {userData: {}} as any;
    it('should sign in user', async () => {
      const spy = jest.spyOn(provider, 'upsertUser');
      spy.mockResolvedValueOnce(mockData);
      expect(await userController.upsertUser(mockDataDTO, mockRequest as any)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    const mockDataDeleteDTO = plainToInstance(UserDeleteDto, userMock);
    it('should sign in user', async () => {
      const spy = jest.spyOn(provider, 'deleteUser');
      expect(await userController.deleteUser(mockDataDeleteDTO)).toEqual(true);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
