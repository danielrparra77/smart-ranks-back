import { StatusEnum } from '../../../common/enum/status.enum';
import { IProduct } from '../../entity/product.entity';
import { IRoleUC } from '../role.uc';

export class UserRoleUC implements IRoleUC {
  getProductFilter(): Partial<IProduct> {
    return {
        status: StatusEnum.active
    };
  }
}