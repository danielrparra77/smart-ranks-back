import { StatusEnum } from '../../common/enum/status.enum';
import { mongoDocument } from './mongo-document.entity';

export interface IProduct extends mongoDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: StatusEnum;  
}