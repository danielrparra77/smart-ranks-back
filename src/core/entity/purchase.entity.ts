import { IProduct } from './product.entity';

export interface IProductToPurchase {
  product: Partial<IProduct>,
  number: number,
  productValidated?: IProduct,
}
