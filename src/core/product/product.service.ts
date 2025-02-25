import { Injectable } from '@nestjs/common';
import { IProduct } from '../entity/product.entity';
import { IUserCredentials } from '../entity/user-credentials.entity';
import { IInvoice } from '../entity/invoice.entity';
import { IProductToPurchase } from '../entity/purchase.entity';

@Injectable()
export abstract class IProductService {
  /**
   * find product by id in database
   * @param id product id
   * @returns product data
   */
  abstract findProductById(id: string): Promise<IProduct>;

  /**
   * find product all products
   * @param credentials user login credentials
   * @returns products array
   */
  abstract findAllProducts(credentials: IUserCredentials): Promise<IProduct[]>;
  
  /**
    * create product if not exists, otherwise update product data
    * @param product data of product to update
    * @returns user data
    */
  abstract upsertProduct(product: Partial<IProduct>): Promise<IProduct>;

  /**
   * purchase product and generate purchase
   * @param products products to buy
   * @param credentials user login credentials
   * @returns invoice of purchase
   */
  abstract purchaseProduct(
    products: IProductToPurchase[],
    credentials: IUserCredentials,
  ): Promise<IInvoice>;
}
