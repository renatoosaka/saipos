import { UserData } from '../../../domain/entities/users';

export interface FindUserByEmail {
  find(email: string): Promise<UserData | undefined>;
}
