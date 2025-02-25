import { Injectable } from '@nestjs/common';
import { Product } from '../../schema/product.schema';
import { IProduct } from '../../core/entity/product.entity';

@Injectable()
export abstract class IProductProvider {
  /**
   * find all products by filer
   * @returns products data
   */
  abstract findAllProducts(filter: Partial<IProduct>): Promise<Product[]>;

  /**
   * find product by id in database
   * @param id product id
   * @returns product data
   */
  abstract findProductById(id: string): Promise<Product | null>;

  /**
   * create product if not exists, otherwise update product data
   * @param product data of product to update
   * @returns product data
   */
  abstract upsertProduct(product: Partial<IProduct>): Promise<Product>;

  /**
   * delete product by email
   * @param id product id
   */
  abstract deleteProduct(id: string): Promise<void>;
}
