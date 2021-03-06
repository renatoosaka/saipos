import { AddUser } from './add-user';
import { FindUserByEmail } from './find-user-by-email';

export * from './add-user';
export * from './find-user-by-email';

export interface UserRepository extends AddUser, FindUserByEmail {}
