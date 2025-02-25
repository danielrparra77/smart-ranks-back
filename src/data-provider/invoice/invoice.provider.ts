import { Injectable } from '@nestjs/common';
import { Invoice } from '../../schema/invoice.schema';
import { IInvoice } from '../../core/entity/invoice.entity';

@Injectable()
export abstract class IInvoiceProvider {
  /**
   * get all invoices ids created
   * @returns invoices ids
   */
  abstract findAllInvoicesIds(): Promise<string[]>;

  /**
   * find invoice by id in database
   * @param id invoice id
   * @returns invoice data
   */
  abstract findInvoiceById(id: string): Promise<IInvoice | null>;

  /**
   * create invoice if not exists, otherwise update invoice data
   * @param invoice data of invoice to update
   * @returns invoice data
   */
  abstract upsertInvoice(invoice: Partial<IInvoice>): Promise<Invoice>;
}
