import { RoleEnum } from '../../common/enum/role.enum';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;  
}