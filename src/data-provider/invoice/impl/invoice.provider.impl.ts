import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IInvoiceProvider } from '../invoice.provider';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from '../../../schema/invoice.schema';
import { IInvoice } from 'src/core/entity/invoice.entity';

@Injectable()
export class InvoiceProvider implements IInvoiceProvider {
  constructor(
    @InjectModel(Invoice.name) private productModel: Model<Invoice>,
  ) {}

  async findAllInvoicesIds(): Promise<string[]> {
    return await this.productModel.find({},{id: true});
  }

  async findInvoiceById(id: string): Promise<IInvoice | null> {
    return await this.productModel.findOne({id});
  }

  async upsertInvoice(invoice: Partial<IInvoice>): Promise<Invoice> {
    const userUpdated = await this.productModel.findOneAndUpdate({id: invoice.id}, { $set: invoice }, {upsert: true});
    return Invoice.build(userUpdated)
  }
}
