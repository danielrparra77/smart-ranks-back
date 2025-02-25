import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { IInvoiceService } from '../../core/invoice/invoice.service';
import { JestMockedClass } from '../../../test/types/types';
import { Invoice } from '../../schema/invoice.schema';
import { invoiceMock } from '../../../test/mock/invoice.mock';
import { plainToInstance } from 'class-transformer';
import { InvoiceDto } from '../dto/invoice/invoice.dto';

describe('InvoiceController', () => {
  const mockData = Invoice.build(invoiceMock);
  const mockDataDTO = plainToInstance(InvoiceDto, {id: mockData.id});
  const invoiceService: Partial<JestMockedClass<IInvoiceService>> = {
    findAllInvoicesIds: jest.fn(),
    findInvoiceById: jest.fn(),
    upsertInvoice: jest.fn(),
  };

  let invoiceController: InvoiceController;
  let provider: IInvoiceService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [{
        provide: IInvoiceService,
        useValue: invoiceService,
      }],
    })
    .compile();

    invoiceController = app.get<InvoiceController>(InvoiceController);
    provider = app.get<IInvoiceService>(IInvoiceService);
  });

  afterEach(()=>{
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should findAll invoices', async () => {
      const spy = jest.spyOn(provider, 'findAllInvoicesIds');
      spy.mockResolvedValueOnce([mockData.id]);
      expect(await invoiceController.findAll()).toEqual([mockData.id]);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should findById invoice', async () => {
      const spy = jest.spyOn(provider, 'findInvoiceById');
      spy.mockResolvedValueOnce(mockData as any);
      expect(await invoiceController.findById(mockDataDTO)).toEqual(mockData);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
