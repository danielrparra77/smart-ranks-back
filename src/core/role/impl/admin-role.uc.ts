import { IProduct } from '../../entity/product.entity';
import { IRoleUC } from '../role.uc';

export class AdminRoleUC implements IRoleUC {
  getProductFilter(): Partial<IProduct> {
    return {};
  }
}