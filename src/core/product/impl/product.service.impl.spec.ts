import { Test, TestingModule } from '@nestjs/testing';
import { IProductService } from '../product.service';
import { ProductService } from './product.service.impl';
import { JestMockedClass } from '../../../../test/types/types';
import { IProductProvider } from '../../../data-provider/product/product.provider';
import { Product } from '../../../schema/product.schema';
import { productMock } from '../../../../test/mock/product.mock';
import { RoleEnum } from '../../../common/enum/role.enum';
import { IUserCredentials } from '../../entity/user-credentials.entity';
import { User } from '../../../schema/user.schema';
import { userMock } from '../../../../test/mock/user.mock';
import { AdminRoleUC } from '../../role/impl/admin-role.uc';
import { UserRoleUC } from '../../role/impl/user-role.uc';
import { IInvoiceService } from '../../invoice/invoice.service';
import { invoiceMock } from '../../../../test/mock/invoice.mock';
import { NotAcceptableException } from '@nestjs/common';
import { IUserProvider } from '../../../data-provider/user/user.provider';

describe('ProductService', () => {
  let mockData: Product;

  const userMockData = User.build(userMock);
  const credentials: IUserCredentials = {
    id: userMockData.id,
    email: userMockData.email,
    role: userMockData.role,
  };
  const productProvider: JestMockedClass<IProductProvider> = {
    findAllProducts: jest.fn(),
    findProductById: jest.fn(),
    upsertProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };
  const invoiceService: JestMockedClass<IInvoiceService> = {
    findAllInvoicesIds: jest.fn(),
    findInvoiceById: jest.fn(),
    upsertInvoice: jest.fn(),
  };
  const userProvider: JestMockedClass<IUserProvider> = {
    findUsers: jest.fn(),
    findUserByFilter: jest.fn().mockResolvedValue(userMockData),
    upsertUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  let orderService: IProductService;
  let productPProvider: IProductProvider;
  let invoiceSService: IInvoiceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IProductService,
          useClass: ProductService,
        },
        {
          provide: IProductProvider,
          useValue: productProvider,
        },
        {
          provide: IInvoiceService,
          useValue: invoiceService,
        },
        {
          provide: IUserProvider,
          useValue: userProvider,
        },
      ],
    }).compile();

    orderService = app.get<IProductService>(IProductService);
    productPProvider = app.get<IProductProvider>(IProductProvider);
    invoiceSService = app.get<IInvoiceService>(IInvoiceService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
    expect(productPProvider).toBeDefined();
    expect(invoiceSService).toBeDefined();
  });

  beforeEach(()=>{
    mockData = Product.build(productMock);
  })

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findProductsById', () => {
    it('should find products by id', async () => {
      const spy = jest.spyOn(productPProvider, 'findAllProducts');
      spy.mockResolvedValueOnce([mockData]);
      expect(await orderService.findProductsById([mockData.id])).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findProductById', () => {
    it('should find product by id', async () => {
      const spy = jest.spyOn(productPProvider, 'findProductById');
      spy.mockResolvedValueOnce(mockData);
      expect(await orderService.findProductById(mockData.id)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllProductsForCustomer', () => {
  
    it('should find all product for admin for admin role', async () => {
      credentials.role = RoleEnum.administrator;
      const spy = jest.spyOn(productPProvider, 'findAllProducts');
      const spyRoleCredentials = jest.spyOn(orderService as any, 'getRoleCredential');
      spy.mockResolvedValueOnce([mockData]);
      expect(await orderService.findAllProducts(credentials)).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyRoleCredentials.mock.results[0].value).toBeInstanceOf(AdminRoleUC);
    });
  
    it('should find all product for admin for user role', async () => {
      credentials.role = RoleEnum.user;
      const spy = jest.spyOn(productPProvider, 'findAllProducts');
      const spyRoleCredentials = jest.spyOn(orderService as any, 'getRoleCredential');
      spy.mockResolvedValueOnce([mockData]);
      expect(await orderService.findAllProducts(credentials)).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spyRoleCredentials.mock.results[0].value).toBeInstanceOf(UserRoleUC);
    });
  });

  describe('upsertProduct', () => {
    it('should upsert new propuct', async () => {
      delete (mockData as any).id
      const spy = jest.spyOn(productPProvider, 'upsertProduct');
      spy.mockResolvedValueOnce(mockData);
      await orderService.upsertProduct(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should upsert existing propuct', async () => {
      const spy = jest.spyOn(productPProvider, 'upsertProduct');
      spy.mockResolvedValueOnce(mockData);
      await orderService.upsertProduct(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('purchaseProduct', () => {
    it('should purchase propuct and get invoice', async () => {
      const productsPurchase = [{product: mockData, number: 1}];
      const spy = jest.spyOn(productPProvider, 'findProductById');
      spy.mockResolvedValueOnce(mockData);
      const spy1 = jest.spyOn(productPProvider, 'upsertProduct');
      spy1.mockResolvedValueOnce(mockData);
      const spy2 = jest.spyOn(invoiceSService, 'upsertInvoice');
      spy2.mockResolvedValueOnce(invoiceMock);
      expect(await orderService.purchaseProduct(productsPurchase, credentials)).toEqual(invoiceMock);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy1).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledTimes(1);
    });
    it('should throw purchase propuct because there is not enought stock', async () => {
      mockData.stock = 4;
      const productsPurchase = [{product: mockData, number: 5}];
      const spy = jest.spyOn(productPProvider, 'findProductById');
      spy.mockResolvedValueOnce(mockData);
      const spy1 = jest.spyOn(productPProvider, 'upsertProduct');
      spy1.mockResolvedValueOnce(mockData);
      const spy2 = jest.spyOn(invoiceSService, 'upsertInvoice');
      spy2.mockResolvedValueOnce(invoiceMock);
      await expect(orderService.purchaseProduct(productsPurchase, credentials)).rejects.toEqual(new NotAcceptableException('not enought stock'));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy1).toHaveBeenCalledTimes(0);
      expect(spy2).toHaveBeenCalledTimes(0);
    });
  });
});
