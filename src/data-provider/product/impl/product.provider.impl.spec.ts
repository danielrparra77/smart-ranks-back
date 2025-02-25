import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Product } from '../../../schema/product.schema';
import { ProductProvider } from './product.provider.impl';
import { IProductProvider } from '../product.provider';
import { productMock } from '../../../../test/mock/product.mock';

describe('ProductProvider', () => {
  const mockData = Product.build(productMock);
  const modelProvider: Partial<Model<Product>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  };
  
  let productProvider: IProductProvider;
  let model: Model<Product>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IProductProvider,
          useClass: ProductProvider,
        },
        {
          provide: 'ProductModel',
          useValue: modelProvider,
        },
    ],
    }).compile();

    productProvider = app.get<IProductProvider>(IProductProvider);
    model = app.get<Model<Product>>('ProductModel');
  });

  it('should be defined', async () => {
    expect(productProvider).toBeDefined();
    expect(model).toBeDefined();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findAllProducts', () => {
    it('should find all products', async () => {
      const spy = jest.spyOn(model, 'find');
      spy.mockResolvedValueOnce([mockData]);
      expect(await productProvider.findAllProducts(mockData)).toEqual([mockData]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findProductById', () => {
    it('should find product by id', async () => {
      const spy = jest.spyOn(model, 'findOne');
      spy.mockResolvedValueOnce(mockData);
      expect(await productProvider.findProductById(mockData.id)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertProduct', () => {
    it('should upsert product data', async () => {
      const spy = jest.spyOn(model, 'findOneAndUpdate');
      spy.mockResolvedValueOnce(mockData);
      expect(await productProvider.upsertProduct(mockData)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteProduct', () => {
    it('should deleteProduct data', async () => {
      const spy = jest.spyOn(model, 'findOneAndDelete');
      await productProvider.deleteProduct(mockData.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
