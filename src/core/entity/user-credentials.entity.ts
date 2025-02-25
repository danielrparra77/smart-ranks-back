import { RoleEnum } from '../../common/enum/role.enum';

export interface IUserCredentials {
  id: string;
  email: string;
  role: RoleEnum;  
}