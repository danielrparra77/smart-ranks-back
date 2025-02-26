import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ProductController } from './product.controller';
import { IProductService } from '../../core/product/product.service';
import { JestMockedClass } from '../../../test/types/types';
import { Product } from '../../schema/product.schema';
import { productMock } from '../../../test/mock/product.mock';
import { plainToInstance } from 'class-transformer';
import { ProductDto } from '../dto/product/product.dto';
import { PurchaseProductDto } from '../dto/product/purchase.dto';
import { Invoice } from '../../schema/invoice.schema';
import { invoiceMock } from '../../../test/mock/invoice.mock';

describe('ProductController', () => {
  const mockData = Product.build(productMock);
  const mockDataDTO = plainToInstance(ProductDto, productMock);
  const purchaseDTO = plainToInstance(PurchaseProductDto, {products: [{id: uuidv4(), number: 1}]});
  const mockRequest: Partial<Request> = {userData: {}} as any;
  const productService: Partial<JestMockedClass<IProductService>> = {
    findProductsById: jest.fn(),
    findAllProducts: jest.fn(),
    upsertProduct: jest.fn(),
    purchaseProduct: jest.fn(),
  };

  let productController: ProductController;
  let provider: IProductService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{
        provide: IProductService,
        useValue: productService,
      }],
    })
    .compile();

    productController = app.get<ProductController>(ProductController);
    provider = app.get<IProductService>(IProductService);
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findByIds', () => {
    it('should findByIds products', async () => {
      const spy = jest.spyOn(provider, 'findProductsById');
      spy.mockResolvedValueOnce([mockData]);
      expect(await productController.findByIds({_id:['dfgdg']})).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    const token = {access_token: 'token'};
    it('should findAll products', async () => {
      const spy = jest.spyOn(provider, 'findAllProducts');
      spy.mockResolvedValueOnce([mockData]);
      expect(await productController.findAll(mockRequest as any)).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertProduct', () => {
    it('should upsert product', async () => {
      const spy = jest.spyOn(provider, 'upsertProduct');
      spy.mockResolvedValueOnce(mockData);
      expect(await productController.upsertProduct(mockDataDTO)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('purchaseProduct', () => {
    const mockInvoice = Invoice.build(invoiceMock);
    it('should purchase product', async () => {
      const spy = jest.spyOn(provider, 'purchaseProduct');
      spy.mockResolvedValueOnce(mockInvoice as any)
      expect(await productController.purchaseProduct(purchaseDTO, mockRequest as any)).toEqual(mockInvoice);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
