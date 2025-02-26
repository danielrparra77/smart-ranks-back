import { Injectable } from '@nestjs/common';
import { IInvoiceService } from '../invoice.service';
import { IInvoiceProvider } from '../../../data-provider/invoice/invoice.provider';
import { IInvoice } from 'src/core/entity/invoice.entity';

@Injectable()
export class InvoiceService implements IInvoiceService {
  constructor(
    private readonly invoiceProvider: IInvoiceProvider,
  ) {}

  async findInvoiceById(id: string): Promise<IInvoice> {
    const invoiceModel = await this.invoiceProvider.findInvoiceById(id);
    return invoiceModel as IInvoice;
  }

  async findAllInvoicesIds(): Promise<string[]> {
    const invoicesIds = await this.invoiceProvider.findAllInvoicesIds();
    return invoicesIds;
  }

  async upsertInvoice(invoice: Partial<IInvoice>): Promise<IInvoice> {
    const invoiceUpdated = await this.invoiceProvider.upsertInvoice(invoice);
    const invoiceIntrerface = invoiceUpdated as unknown as IInvoice;
    return invoiceIntrerface;
  }
}
