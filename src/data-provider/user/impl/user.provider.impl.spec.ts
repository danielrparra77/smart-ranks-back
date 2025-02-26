import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from '../../../schema/user.schema';
import { UserProvider } from './user.provider.impl';
import { IUserProvider } from '../user.provider';
import { userMock } from '../../../../test/mock/user.mock';

describe('UserProvider', () => {
  const mockData = User.build(userMock);
  const modelProvider: Partial<Model<User>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };
  
  let userProvider: IUserProvider;
  let model: Model<User>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IUserProvider,
          useClass: UserProvider,
        },
        {
          provide: 'UserModel',
          useValue: modelProvider,
        },
    ],
    }).compile();

    userProvider = app.get<IUserProvider>(IUserProvider);
    model = app.get<Model<User>>('UserModel');
  });

  it('should be defined', async () => {
    expect(userProvider).toBeDefined();
    expect(model).toBeDefined();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findUsers', () => {
    it('should find users', async () => {
      const spy = jest.spyOn(model, 'find');
      spy.mockResolvedValueOnce([mockData]);
      expect(await userProvider.findUsers()).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUserByFilter', () => {
    it('should find user by email', async () => {
      const spy = jest.spyOn(model, 'findOne');
      spy.mockResolvedValueOnce(mockData);
      expect(await userProvider.findUserByFilter({email: mockData.email})).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertUser', () => {
    it('should upsert user data', async () => {
      const spy = jest.spyOn(model, 'findOneAndUpdate');
      spy.mockResolvedValueOnce(mockData);
      expect(await userProvider.upsertUser(mockData)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('should deleteUser data', async () => {
      const spy = jest.spyOn(model, 'findOneAndDelete');
      await userProvider.deleteUser(mockData.email);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
