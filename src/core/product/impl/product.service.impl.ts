import { Injectable, NotAcceptableException } from '@nestjs/common';
import { IProductService } from '../product.service';
import { IProductProvider } from '../../../data-provider/product/product.provider';
import { RoleEnum } from '../../../common/enum/role.enum';
import { IUserCredentials } from '../../entity/user-credentials.entity';
import { IProduct } from '../../entity/product.entity';
import { IRoleUC } from '../../role/role.uc';
import { AdminRoleUC } from '../../role/impl/admin-role.uc';
import { UserRoleUC } from '../../role/impl/user-role.uc';
import { IInvoiceService } from '../../invoice/invoice.service';
import { IInvoice } from '../../entity/invoice.entity';
import { IProductToPurchase } from 'src/core/entity/purchase.entity';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly invoiceService: IInvoiceService,
    private readonly productProvider: IProductProvider,
  ) {}

  async findProductById(id: string): Promise<IProduct> {
    const productModel = await this.productProvider.findProductById(id);
    return productModel as IProduct;
  }

  async findAllProducts(credentials: IUserCredentials): Promise<IProduct[]> {
    const roleFilter = this.getRoleCredential(credentials).getProductFilter();
    const products = await this.productProvider.findAllProducts(roleFilter);
    return products as IProduct[];
  }

  async upsertProduct(product: Partial<IProduct>): Promise<IProduct> {
    const productUpdated = await this.productProvider.upsertProduct(product);
    return productUpdated as IProduct;
  }

  async purchaseProduct(
    products: IProductToPurchase[],
    credentials: IUserCredentials,
  ): Promise<IInvoice> {
    products = await this.validateStockProducts(products);
    let invoice:IInvoice = await this.takeProductsStock(products, credentials);
    return this.saveInvoice(invoice);
  }

  private async validateStockProducts(
    products: IProductToPurchase[],
  ): Promise<IProductToPurchase[]> {
    for (const p in products) {
      const product = products[p].product;
      const number = products[p].number;
      const productDetail = await this.findProductById(product.id as string);
      if (number > productDetail.stock)
        throw new NotAcceptableException('not enought stock');
      products[p].productValidated = productDetail;
    }
    return products;
  }

  private async takeProductsStock(
    products: IProductToPurchase[],
    credentials: IUserCredentials,
  ): Promise<IInvoice> {
    const invoice:IInvoice = {date: new Date(), products:[], total: 0, user_id: credentials.id};
    for (const p in products) {
      const productDetail = products[p].productValidated as IProduct;
      const number = products[p].number;
      productDetail.stock -= number;
      invoice.total += number * productDetail.price;
      await this.upsertProduct(productDetail);
    }
    return invoice;
  }

  private async saveInvoice(
    invoice:IInvoice,
  ): Promise<IInvoice> {
    return await this.invoiceService.upsertInvoice(invoice);
  }

  private getRoleCredential(credentials: IUserCredentials) : IRoleUC {
    let roleCredentials:IRoleUC;
    if (credentials.role == RoleEnum.administrator)
      roleCredentials = new AdminRoleUC();
    else
      roleCredentials = new UserRoleUC();
    return roleCredentials;
  }
}
