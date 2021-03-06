import { UserData } from '../../../domain/entities/users';

export interface AddUserDTO {
  name: string;
  email: string;
}

export interface AddUser {
  add(data: AddUserDTO): Promise<UserData>;
}
