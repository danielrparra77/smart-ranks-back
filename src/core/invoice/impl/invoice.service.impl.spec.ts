import { Test, TestingModule } from '@nestjs/testing';
import { IInvoiceService } from '../invoice.service';
import { InvoiceService } from './invoice.service.impl';
import { JestMockedClass } from '../../../../test/types/types';
import { IInvoiceProvider } from '../../../data-provider/invoice/invoice.provider';
import { Invoice } from '../../../schema/invoice.schema';
import { invoiceMock } from '../../../../test/mock/invoice.mock';

describe('InvoiceService', () => {
  let mockData: Invoice;
  const invoiceProvider: JestMockedClass<IInvoiceProvider> = {
    findAllInvoicesIds: jest.fn(),
    findInvoiceById: jest.fn(),
    upsertInvoice: jest.fn(),
  };

  let invoiceService: IInvoiceService;
  let invoicePProvider: IInvoiceProvider;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: IInvoiceService,
          useClass: InvoiceService,
        },
        {
          provide: IInvoiceProvider,
          useValue: invoiceProvider,
        },
      ],
    }).compile();

    invoiceService = app.get<IInvoiceService>(IInvoiceService);
    invoicePProvider = app.get<IInvoiceProvider>(IInvoiceProvider);
  });

  it('should be defined', () => {
    expect(invoiceService).toBeDefined();
    expect(invoicePProvider).toBeDefined();
  });

  beforeEach(()=>{
    mockData = Invoice.build(invoiceMock);
  })

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findInvoiceById', () => {
    it('should find invoice by id', async () => {
      const spy = jest.spyOn(invoicePProvider, 'findInvoiceById');
      spy.mockResolvedValueOnce(mockData as any);
      expect(await invoiceService.findInvoiceById(mockData.id)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAllInvoicesIds', () => {
    it('should find all invoice ids', async () => {
      const spy = jest.spyOn(invoicePProvider, 'findAllInvoicesIds');
      spy.mockResolvedValueOnce([mockData.id]);
      expect(await invoiceService.findAllInvoicesIds()).toEqual([mockData.id]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertInvoice', () => {
    it('should upsert invoice', async () => {
      const spy = jest.spyOn(invoicePProvider, 'upsertInvoice');
      spy.mockResolvedValueOnce(mockData);
      await invoiceService.upsertInvoice(mockData as any);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
