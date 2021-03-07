import faker from 'faker';
import { UserData } from '../../domain/entities/users';
import { TodoData } from '../../domain/entities/todos/todo-data';
import { UpdateTodoStatusUseCase } from './update-todo-status-usecase';
import {
  AddHistory,
  AddHistoryDTO,
  CountTodoTypeHistoryDTO,
  HistoryRepository,
} from '../protocols/history-repository';
import { UpdateTodoStatus } from '../protocols/update-todo-status-protocols';
import {
  AddTodoDTO,
  TodoRepository,
  UpdateTodoDTO,
} from '../protocols/todo-repository';
import { TodoLimitReopenError, TodoNotFoundError } from '../errors';

interface SutTypes {
  sut: UpdateTodoStatus;
  historyRepositoryStub: HistoryRepository;
  todoRepositoryStub: TodoRepository;
}

const makeValidUser = (): UserData => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUser();

const makeValidTodoData = (): TodoData => ({
  id: faker.random.uuid(),
  description: faker.lorem.sentence(),
  completed: false,
  user: validUser,
});

const validTodo = makeValidTodoData();

const makeTodoRepositoryStub = (): TodoRepository => {
  class TodoRepositoryStub implements TodoRepository {
    async add(data: AddTodoDTO): Promise<TodoData> {
      throw new Error('Method not implemented.');
    }

    async all(): Promise<TodoData[]> {
      throw new Error('Method not implemented.');
    }

    async update(data: UpdateTodoDTO): Promise<TodoData> {
      return {
        ...validTodo,
        id: data.id,
        completed: data.completed,
      };
    }

    async find(id: string): Promise<TodoData | undefined> {
      return {
        ...validTodo,
        id,
      };
    }
  }

  return new TodoRepositoryStub();
};

const makeHistoryRepositoryStub = (): HistoryRepository => {
  class HistoryRepositoryStub implements HistoryRepository {
    async count(data: CountTodoTypeHistoryDTO): Promise<number> {
      return 1;
    }

    async add(data: AddHistoryDTO): Promise<void> {
      console.log(data);
    }
  }

  return new HistoryRepositoryStub();
};

const makeSut = (): SutTypes => {
  const historyRepositoryStub = makeHistoryRepositoryStub();
  const todoRepositoryStub = makeTodoRepositoryStub();
  const sut = new UpdateTodoStatusUseCase(
    todoRepositoryStub,
    historyRepositoryStub,
  );

  return { sut, todoRepositoryStub, historyRepositoryStub };
};

const makeValidRequest = (): UpdateTodoDTO => ({
  id: validTodo.id as string,
  completed: true,
});

describe('#UpdateTodoStatus UseCase', () => {
  it('should call TodoRepository.find with correct value', async () => {
    const { sut, todoRepositoryStub } = makeSut();

    const findSpy = jest.spyOn(todoRepositoryStub, 'find');

    const requestData = makeValidRequest();
    await sut.update(requestData);

    expect(findSpy).toHaveBeenCalledWith(requestData.id);
  });

  it('should call TodoRepository.update with correct value', async () => {
    const { sut, todoRepositoryStub } = makeSut();

    const updateSpy = jest.spyOn(todoRepositoryStub, 'update');

    const requestData = makeValidRequest();
    await sut.update(requestData);

    expect(updateSpy).toHaveBeenCalledWith({
      id: requestData.id,
      completed: requestData.completed,
    });
  });

  it('should call HistoryRepository.count with correct value', async () => {
    const { sut, historyRepositoryStub } = makeSut();

    const countSpy = jest.spyOn(historyRepositoryStub, 'count');

    await sut.update(makeValidRequest());

    expect(countSpy).toHaveBeenCalledWith({
      type: 'reopened',
      todo_id: validTodo.id,
    });
  });

  it('should call HistoryRepository.add with correct value', async () => {
    const { sut, historyRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(historyRepositoryStub, 'add');

    await sut.update(makeValidRequest());

    expect(addSpy).toHaveBeenCalledWith({
      type: 'completed',
      todo_id: validTodo.id,
    });
  });

  it('should throws an error if any dependency throw', async () => {
    const { sut, todoRepositoryStub, historyRepositoryStub } = makeSut();

    jest.spyOn(todoRepositoryStub, 'find').mockRejectedValueOnce(new Error());

    await expect(sut.update(makeValidRequest())).rejects.toThrow();

    jest.spyOn(todoRepositoryStub, 'update').mockRejectedValueOnce(new Error());

    await expect(sut.update(makeValidRequest())).rejects.toThrow();

    jest
      .spyOn(historyRepositoryStub, 'count')
      .mockRejectedValueOnce(new Error());

    await expect(sut.update(makeValidRequest())).rejects.toThrow();

    jest.spyOn(historyRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.update(makeValidRequest())).rejects.toThrow();
  });

  it('should return max limit reopened error if its greather than or equal 2', async () => {
    const { sut, historyRepositoryStub } = makeSut();

    jest.spyOn(historyRepositoryStub, 'count').mockResolvedValueOnce(2);

    const requestData = makeValidRequest();
    const error = await sut.update(requestData);

    expect(error.value).toEqual(new TodoLimitReopenError(requestData.id));
  });

  it('should return todo not found error if no todo was founded', async () => {
    const { sut, todoRepositoryStub } = makeSut();

    jest.spyOn(todoRepositoryStub, 'find').mockResolvedValueOnce(undefined);

    const requestData = makeValidRequest();
    const error = await sut.update(requestData);

    expect(error.value).toEqual(new TodoNotFoundError(requestData.id));
  });

  it('should return an updated Todo on success', async () => {
    const { sut } = makeSut();

    const requestData = makeValidRequest();

    const todoOrError = await sut.update(requestData);

    const todo = todoOrError.value as TodoData;

    expect(todoOrError.isRight()).toBe(true);
    expect(todo.id).toEqual(validTodo.id);
    expect(todo.description).toEqual(validTodo.description);
    expect(todo.completed).toEqual(true);
    expect(todo.user.id).toEqual(validUser.id);
    expect(todo.user.name).toEqual(validUser.name);
    expect(todo.user.email).toEqual(validUser.email);
  });
});
