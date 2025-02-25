import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { IProductService } from '../../core/product/product.service';
import { Roles } from '../../common/decorator/roles.decorator';
import { RoleEnum } from '../../common/enum/role.enum';
import { IUserCredentials } from '../../core/entity/user-credentials.entity';
import { Request } from 'express';
import { IProduct } from '../../core/entity/product.entity';
import { ProductDto } from '../dto/product/product.dto';
import { PurchaseProductDto } from '../dto/product/purchase.dto';
import { IProductToPurchase } from '../../core/entity/purchase.entity';

@Controller({path: 'product'})
export class ProductController {
  constructor(private readonly productService: IProductService) {}

  @Get()
  @Roles([RoleEnum.administrator, RoleEnum.user])
  findAll(@Req() request: Request): Promise<IProduct[]> {
    const credentials = (request as any).userData as IUserCredentials;
    return this.productService.findAllProducts(credentials);
  }

  @Post()
  @Roles([RoleEnum.administrator])
  async upsertProduct(
    @Body() product: ProductDto,
  ): Promise<ProductDto> {
    await this.productService.upsertProduct(product);
    return product;
  }

  @Put()
  @Roles([RoleEnum.user])
  async purchaseProduct(
    @Body() purchase: PurchaseProductDto,
    @Req() request: Request,
  ): Promise<void> {
    const credentials = (request as any).userData as IUserCredentials;
    const products = this.formatProductsToPruchase(purchase);
    await this.productService.purchaseProduct(products, credentials);
    return;
  }

  private formatProductsToPruchase(purchase: PurchaseProductDto): IProductToPurchase[] {
    let products: IProductToPurchase[] = [];
    for (const i in purchase.products){
      const product = purchase.products[i];
      products.push({product: {id:product.id}, number: product.number});
    }
    return products;
  }
}
