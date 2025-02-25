import { IInvoice } from '../../src/core/entity/invoice.entity';
import { v4 as uuidv4 } from 'uuid';

export const invoiceMock = {
  id: uuidv4(),
  user_id: uuidv4(),
  products: [uuidv4()],
  total: 500000,
  date: new Date(),
} as IInvoice;