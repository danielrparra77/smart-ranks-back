import { Injectable } from '@nestjs/common';
import { IInvoice } from '../entity/invoice.entity';

@Injectable()
export abstract class IInvoiceService {
  /**
   * find invoice by id in database
   * @param id invoice id
   * @returns invoice data
   */
  abstract findInvoiceById(id: string): Promise<IInvoice>;

  /**
   * find product all invoice ids
   * @returns products array
   */
  abstract findAllInvoicesIds(): Promise<string[]>;
  
  /**
    * create invoice if not exists, otherwise update invoice data
    * @param invoice data of invoice to update
    * @returns user data
    */
  abstract upsertInvoice(invoice: Partial<IInvoice>): Promise<IInvoice>;
}
