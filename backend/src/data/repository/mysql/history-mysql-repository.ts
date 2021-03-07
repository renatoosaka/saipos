import { v4 } from 'uuid';
import { MySQLDB } from '../../../infra/database/mysql';
import {
  AddHistoryDTO,
  CountTodoTypeHistoryDTO,
  HistoryRepository,
  CountTodoTypeHistory,
} from '../../../usecases/protocols/history-repository';

export class HistoryMySQLRepository
  implements HistoryRepository, CountTodoTypeHistory {
  async count(data: CountTodoTypeHistoryDTO): Promise<number> {
    const [rows, _] = await MySQLDB.client.execute(
      `
      SELECT COUNT(*) AS count
        FROM history
      WHERE todo_id = ?
        AND type = ?
    `,
      [data.todo_id, data.type],
    );

    return rows[0].count ?? 0;
  }

  async add(data: AddHistoryDTO): Promise<void> {
    const id = v4();
    const { todo_id, type } = data;

    await MySQLDB.client.execute(
      'INSERT INTO history (id, todo_id, type) VALUES (?, ?, ?)',
      [id, todo_id, type],
    );
  }
}
