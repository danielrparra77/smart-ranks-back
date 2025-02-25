import { RoleEnum } from '../../src/common/enum/role.enum';
import { IUser } from '../../src/core/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';

export const userMock = {
  email: 'correo@correo.com',
  name: 'nombre',
  password: 'contra',
  role: RoleEnum.user,
  id: uuidv4(),
} as IUser;