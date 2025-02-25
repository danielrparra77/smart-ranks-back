import { StatusEnum } from '../../src/common/enum/status.enum';
import { IProduct } from '../../src/core/entity/product.entity';
import { v4 as uuidv4 } from 'uuid';

export const productMock = {
  id: uuidv4(),
  name: 'nombre',
  description: 'descripcion',
  price: 200000,
  stock: 50,
  status: StatusEnum.active,
} as IProduct;