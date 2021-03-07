import { v4 } from 'uuid';
import { MySQLDB } from '../../../infra/database/mysql';
import {
  AddHistoryDTO,
  HistoryRepository,
} from '../../../usecases/protocols/history-repository';

export class HistoryMySQLRepository implements HistoryRepository {
  async add(data: AddHistoryDTO): Promise<void> {
    const id = v4();
    const { todo_id, type } = data;

    await MySQLDB.client.execute(
      'INSERT INTO history (id, todo_id, type) VALUES (?, ?, ?)',
      [id, todo_id, type],
    );
  }
}
