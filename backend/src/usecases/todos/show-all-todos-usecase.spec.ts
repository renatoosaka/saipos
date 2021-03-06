import faker from 'faker';
import { TodoData } from '../../domain/entities/todos/todo-data';
import { UserData } from '../../domain/entities/users';
import { ShowAllTodos } from '../protocols/show-all-todos-protocol';
import { AllTodos } from '../protocols/todo-repository';
import { ShowAllTodosUseCase } from './show-all-todos-usecase';

interface SutTypes {
  sut: ShowAllTodos;
  allTodosStub: AllTodos;
}

const makeValidUser = (): UserData => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUser();

const makeAllTodosStub = (): AllTodos => {
  class AllTodosStub implements AllTodos {
    async all(): Promise<TodoData[]> {
      return [
        {
          id: faker.random.uuid(),
          description: faker.lorem.sentence(),
          completed: false,
          user: validUser,
        },
        {
          id: faker.random.uuid(),
          description: faker.lorem.sentence(),
          completed: true,
          user: validUser,
        },
      ];
    }
  }

  return new AllTodosStub();
};

const makeSut = (): SutTypes => {
  const allTodosStub = makeAllTodosStub();
  const sut = new ShowAllTodosUseCase(allTodosStub);

  return { sut, allTodosStub };
};

describe('#ShowAllTodos UseCase', () => {
  it('should return an empty array if nothing was found', async () => {
    const { sut, allTodosStub } = makeSut();

    jest.spyOn(allTodosStub, 'all').mockResolvedValueOnce([]);

    const result = await sut.all();

    expect(result.length).toBe(0);
  });

  it('should return an array with todos on success', async () => {
    const { sut } = makeSut();
    const todos = await sut.all();

    expect(todos.length).toBeGreaterThanOrEqual(1);
  });
});
