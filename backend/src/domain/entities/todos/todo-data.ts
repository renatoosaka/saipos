import { UserData } from '../users';

export interface TodoData {
  id?: string;
  description: string;
  completed?: boolean;
  user: UserData;
}
