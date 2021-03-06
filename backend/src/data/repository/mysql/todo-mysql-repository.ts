import { v4 } from 'uuid';
import { RowDataPacket } from 'mysql2';
import { MySQLDB } from '../../../infra/database/mysql';
import { TodoData } from '../../../domain/entities/todos/todo-data';
import {
  AddTodo,
  AddTodoDTO,
  AllTodos,
} from '../../../usecases/protocols/todo-repository';

export class TodoMySQLRepository implements AddTodo, AllTodos {
  async all(): Promise<TodoData[]> {
    const todos: TodoData[] = [];
    const [rows, _] = await MySQLDB.client.execute<RowDataPacket[]>(
      `SELECT todos.*, users.name, users.email
         FROM todos
        INNER JOIN users ON (users.id = todos.user_id)`,
    );

    for (const row of rows) {
      todos.push({
        id: row.id,
        description: row.description,
        completed: row.completed,
        user: {
          id: row.user_id,
          name: row.name,
          email: row.email,
        },
      });
    }

    return todos;
  }

  async add(data: AddTodoDTO): Promise<TodoData> {
    const id = v4();
    const { description, user_id } = data;
    await MySQLDB.client.execute(
      'INSERT INTO todos ( id, description, user_id ) VALUES (?, ?, ?)',
      [id, description, user_id],
    );

    const [
      rows,
      _,
    ] = await MySQLDB.client.execute('SELECT * FROM users WHERE id = ?', [
      user_id,
    ]);

    const user = rows[0];

    return {
      id,
      description,
      completed: false,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
