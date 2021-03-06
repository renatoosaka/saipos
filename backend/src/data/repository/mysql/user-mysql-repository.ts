import { v4 } from 'uuid';
import { UserData } from '../../../domain/entities/users';
import { MySQLDB } from '../../../infra/database/mysql';
import {
  AddUserDTO,
  UserRepository,
} from '../../../usecases/protocols/user-repository';

export class UserMySQLRepository implements UserRepository {
  async add(data: AddUserDTO): Promise<UserData> {
    const id = v4();
    const { name, email } = data;

    await MySQLDB.client.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [id, name, email],
    );

    return {
      id,
      name,
      email,
    };
  }

  async find(email: string): Promise<UserData | undefined> {
    const [
      rows,
      _,
    ] = await MySQLDB.client.execute('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    if (!rows || !rows[0]) {
      return undefined;
    }

    const user = rows[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
