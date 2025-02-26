import { Injectable, NotAcceptableException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
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
import { IProductToPurchase } from '../../entity/purchase.entity';
import { IUserProvider } from '../../../data-provider/user/user.provider';
import { IUser } from 'src/core/entity/user.entity';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    private readonly invoiceService: IInvoiceService,
    private readonly productProvider: IProductProvider,
    private readonly userProvider: IUserProvider,
  ) {}

  async findProductById(id: string): Promise<IProduct> {
    const productModel = await this.productProvider.findProductById(id);
    return productModel as IProduct;
  }

  async findProductsById(_ids: string[]): Promise<IProduct[]> {
    const filter = { _id: { $in: _ids }};
    return await this.productProvider.findAllProducts(filter as any);
  }

  async findAllProducts(credentials: IUserCredentials): Promise<IProduct[]> {
    const roleFilter = this.getRoleCredential(credentials).getProductFilter();
    const products = await this.productProvider.findAllProducts(roleFilter);
    return products as IProduct[];
  }

  async upsertProduct(product: Partial<IProduct>): Promise<IProduct> {
    if (!product.id) product.id = uuidv4();
    const productUpdated = await this.productProvider.upsertProduct(product);
    return productUpdated as IProduct;
  }

  async purchaseProduct(
    products: IProductToPurchase[],
    credentials: IUserCredentials,
  ): Promise<IInvoice> {
    const userDta = await this.findUserData(credentials);
    products = await this.validateStockProducts(products);
    let invoice:IInvoice = await this.takeProductsStock(products, userDta);
    return await this.saveInvoice(invoice);
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

  private async findUserData(credentials: IUserCredentials): Promise<IUser> {
    return await this.userProvider.findUserByFilter({email: credentials.email}) as IUser;
  }

  private async takeProductsStock(
    products: IProductToPurchase[],
    credentials: IUser,
  ): Promise<IInvoice> {
    const invoice:IInvoice = {
      date: new Date(),
      products:[],
      total: 0,
      id: uuidv4(),
      user_id: credentials._id as string,
    };
    for (const p in products) {
      const productDetail = products[p].productValidated as IProduct;
      const number = products[p].number;
      productDetail.stock -= number;
      invoice.total += number * productDetail.price;
      await this.upsertProduct(productDetail);
      invoice.products.push(productDetail._id as string);
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
