import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Product } from '../../../schema/product.schema';
import { InvoiceProvider } from './invoice.provider.impl';
import { IInvoiceProvider } from '../invoice.provider';
import { invoiceMock } from '../../../../test/mock/invoice.mock';

describe('InvoiceProvider', () => {
  const mockData = Product.build(invoiceMock);
  const modelProvider: Partial<Model<Product>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };
  
  let invoiceProvider: IInvoiceProvider;
  let model: Model<Product>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IInvoiceProvider,
          useClass: InvoiceProvider,
        },
        {
          provide: 'InvoiceModel',
          useValue: modelProvider,
        },
    ],
    }).compile();

    invoiceProvider = app.get<IInvoiceProvider>(IInvoiceProvider);
    model = app.get<Model<Product>>('InvoiceModel');
  });

  it('should be defined', async () => {
    expect(invoiceProvider).toBeDefined();
    expect(model).toBeDefined();
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findAllInvoicesIds', () => {
    it('should find all invoices ids', async () => {
      const spy = jest.spyOn(model, 'find');
      spy.mockResolvedValueOnce([mockData]);
      expect(await invoiceProvider.findAllInvoicesIds()).toEqual([mockData.id]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findInvoiceById', () => {
    it('should find invoice by id', async () => {
      const spy = jest.spyOn(model, 'findOne');
      spy.mockResolvedValueOnce(mockData);
      expect(await invoiceProvider.findInvoiceById(mockData.id)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertInvoice', () => {
    it('should upsert product data', async () => {
      const spy = jest.spyOn(model, 'findOneAndUpdate');
      spy.mockResolvedValueOnce(mockData);
      expect(await invoiceProvider.upsertInvoice(mockData)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
