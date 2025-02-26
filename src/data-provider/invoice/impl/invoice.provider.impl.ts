import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IInvoiceProvider } from '../invoice.provider';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from '../../../schema/invoice.schema';
import { IInvoice } from '../../../core/entity/invoice.entity';

@Injectable()
export class InvoiceProvider implements IInvoiceProvider {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async findAllInvoicesIds(): Promise<string[]> {
    const dataInvoices = await this.invoiceModel.find({},{id: true});
    let ids:string[] = [];
    for (const i in dataInvoices)
      ids.push(dataInvoices[i].id);
    return ids;
  }

  async findInvoiceById(id: string): Promise<IInvoice | null> {
    return await this.invoiceModel.findOne({id});
  }

  async upsertInvoice(invoice: Partial<IInvoice>): Promise<Invoice> {
    const userUpdated = await this.invoiceModel.findOneAndUpdate({id: invoice.id}, { $set: invoice }, {upsert: true, returnDocument: 'after'});
    return userUpdated;
  }
}
