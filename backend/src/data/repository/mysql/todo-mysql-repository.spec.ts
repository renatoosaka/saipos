import faker from 'faker';
import { v4 } from 'uuid';
import { MySQLDB } from '../../../infra/database/mysql';
import {
  AddTodoDTO,
  TodoRepository,
} from '../../../usecases/protocols/todo-repository';
import { TodoMySQLRepository } from './todo-mysql-repository';
import { UserData } from '../../../domain/entities/users';

const makeSut = (): TodoRepository => {
  return new TodoMySQLRepository();
};

const makeValidUserData = (): UserData => ({
  id: v4(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUserData();

const makeValidCreateData = (): AddTodoDTO => ({
  description: faker.lorem.sentence(),
  user_id: validUser.id as string,
});

describe('#TodoMySQLRepository', () => {
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
  });

  afterAll(async () => {
    await MySQLDB.client.execute('DELETE FROM todos;');
    await MySQLDB.client.execute('DELETE FROM users;');
    await MySQLDB.disconnect();
  });

  it('should return a TODO on success', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    const todo = await sut.add(createDataDTO);

    expect(todo).toBeTruthy();
    expect(todo.id).toBeTruthy();
    expect(todo.completed).toBeFalsy();
    expect(todo.user.name).toEqual(validUser.name);
    expect(todo.user.email).toEqual(validUser.email);
  });

  it('should return all todo', async () => {
    const sut = makeSut();

    await sut.add(makeValidCreateData());

    const todos = await sut.all();

    expect(todos).toBeTruthy();
    expect(todos.length).toBeGreaterThanOrEqual(1);
  });

  it('should return a todo by id', async () => {
    const sut = makeSut();

    const todo_created = await sut.add(makeValidCreateData());

    const todo = await sut.find(todo_created.id as string);

    expect(todo).toBeTruthy();
    expect(todo?.id).toEqual(todo_created.id);
  });

  it('should return update todo to completed', async () => {
    const sut = makeSut();

    const todo_created = await sut.add(makeValidCreateData());

    const todo = await sut.update({
      id: todo_created.id as string,
      completed: true,
    });

    expect(todo).toBeTruthy();
    expect(todo.id).toEqual(todo_created.id);
    expect(todo.completed).toBeTruthy();
  });
});
