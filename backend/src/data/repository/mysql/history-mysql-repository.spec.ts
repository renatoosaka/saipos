import faker from 'faker';
import { v4 } from 'uuid';
import { MySQLDB } from '../../../infra/database/mysql';
import { UserData } from '../../../domain/entities/users';
import { HistoryMySQLRepository } from './history-mysql-repository';
import { TodoData } from '../../../domain/entities/todos/todo-data';

const makeSut = (): HistoryMySQLRepository => {
  return new HistoryMySQLRepository();
};

const makeValidUserData = (): UserData => ({
  id: v4(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUserData();

const makeValidTodoData = (): TodoData => ({
  id: v4(),
  description: faker.lorem.sentence(),
  completed: false,
  user: validUser,
});

const validTodo = makeValidTodoData();

describe('#HistoryMySQLRepository', () => {
  beforeAll(async () => {
    await MySQLDB.connect({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'saipos_todo_test',
      port: 3306,
    });

    await MySQLDB.client.execute(
      'INSERT INTO users (id, name, email) VALUES (?, ?, ?)',
      [validUser.id, validUser.name, validUser.email],
    );

    await MySQLDB.client.execute(
      'INSERT INTO todos (id, description, user_id) VALUES (?, ?, ?)',
      [validTodo.id, validTodo.description, validUser.id],
    );
  });

  afterAll(async () => {
    await MySQLDB.client.execute('DELETE FROM history;');
    await MySQLDB.disconnect();
  });

  it('should return a history on success', async () => {
    const sut = makeSut();

    await sut.add({
      todo_id: validTodo.id as string,
      type: 'created',
    });

    const [rows, _] = await MySQLDB.client.execute(
      'SELECT * FROM history ORDER BY date_time DESC LIMIT 1',
    );

    const history = rows[0];

    expect(history).toBeTruthy();
    expect(history.id).toBeTruthy();
    expect(history.todo_id).toEqual(validTodo.id);
    expect(history.type).toEqual('created');
  });

  it('should return 1 history count', async () => {
    const sut = makeSut();

    const count = await sut.count({
      todo_id: validTodo.id as string,
      type: 'created',
    });

    expect(count).toBeTruthy();
    expect(count).toEqual(1);
  });
});
