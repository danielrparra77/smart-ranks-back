import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IProductProvider } from '../product.provider';
import { InjectModel } from '@nestjs/mongoose';
import { IProduct } from '../../../core/entity/product.entity';
import { Product } from '../../../schema/product.schema';

@Injectable()
export class ProductProvider implements IProductProvider {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAllProducts(filter: Partial<IProduct>): Promise<Product[]> {
    return await this.productModel.find(filter);
  }

  async findProductById(id: string): Promise<Product | null> {
    return await this.productModel.findOne({id});
  }

  async upsertProduct(product: Partial<IProduct>): Promise<Product> {
    const userUpdated = await this.productModel.findOneAndUpdate({id: product.id}, { $set: product }, {upsert: true, returnDocument: 'after'});
    return userUpdated;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productModel.findOneAndDelete({id});
  }
}
