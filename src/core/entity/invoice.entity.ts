import { mongoDocument } from './mongo-document.entity';

export interface IInvoice extends mongoDocument {
  id?: string;
  user_id: string;
  products: string[];
  total: number;
  date: Date;
}