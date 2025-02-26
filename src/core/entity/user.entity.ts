import { RoleEnum } from '../../common/enum/role.enum';
import { mongoDocument } from './mongo-document.entity';

export interface IUser extends mongoDocument {
  id: string;
  name: string;
  email: string;
  password: string;
  role: RoleEnum;  
}