import faker from 'faker';
import { Controller } from '../../protocols/controller-protocol';
import { ShowAllTodos } from '../../../usecases/protocols/show-all-todos-protocol';
import { TodoData } from '../../../domain/entities/todos/todo-data';
import { ShowAllTodosController } from './show-all-todos-controller';

interface SutTypes {
  sut: Controller;
  showAllTodosStub: ShowAllTodos;
}

const makeShowAllTodosStub = (): ShowAllTodos => {
  class ShowAllTodosStub implements ShowAllTodos {
    async all(): Promise<TodoData[]> {
      return [
        {
          id: faker.random.uuid(),
          description: faker.lorem.sentence(),
          completed: false,
          user: {
            id: faker.random.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
          },
        },
        {
          id: faker.random.uuid(),
          description: faker.lorem.sentence(),
          completed: true,
          user: {
            id: faker.random.uuid(),
            name: faker.name.findName(),
            email: faker.internet.email(),
          },
        },
      ];
    }
  }

  return new ShowAllTodosStub();
};

const makeSut = (): SutTypes => {
  const showAllTodosStub = makeShowAllTodosStub();
  const sut = new ShowAllTodosController(showAllTodosStub);

  return { sut, showAllTodosStub };
};

describe('#ShowAllTodos Controller', () => {
  it('should call usecase with correct value', async () => {
    const { sut, showAllTodosStub } = makeSut();

    const showSpy = jest.spyOn(showAllTodosStub, 'all');

    await sut.handle({});

    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an empty arrat if no order was found', async () => {
    const { sut, showAllTodosStub } = makeSut();

    jest.spyOn(showAllTodosStub, 'all').mockResolvedValueOnce([]);

    const response = await sut.handle({});

    expect(response.body.length).toBe(0);
  });

  it('should return 500 usecase throws', async () => {
    const { sut, showAllTodosStub } = makeSut();

    jest.spyOn(showAllTodosStub, 'all').mockRejectedValueOnce(new Error());

    const response = await sut.handle({});

    expect(response.status_code).toBe(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response.status_code).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
  });
});
