import { StatusEnum } from '../../common/enum/status.enum';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  status: StatusEnum;  
}