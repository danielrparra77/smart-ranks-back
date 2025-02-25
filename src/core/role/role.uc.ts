import { IProduct } from '../entity/product.entity';

export abstract class IRoleUC {
  /**
   * generate the filter for each role in order to get all database products
   * @returns mongodb query filter
   */
  abstract getProductFilter(): Partial<IProduct>;
}