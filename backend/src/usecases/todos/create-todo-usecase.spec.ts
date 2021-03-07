import faker from 'faker';
import { UserData } from '../../domain/entities/users';
import { CreateTodoUseCase } from './create-todo-usecase';
import { TodoData } from '../../domain/entities/todos/todo-data';
import { AddTodo, AddTodoDTO } from '../protocols/todo-repository';
import { AddUserDTO, UserRepository } from '../protocols/user-repository';
import { InvalidEmailError, RequiredValueError } from '../../domain/errors';
import { CreateTodo, CreateTodoDTO } from '../protocols/create-todo-protocols';
import { AddHistory, AddHistoryDTO } from '../protocols/history-repository';

interface SutTypes {
  sut: CreateTodo;
  addTodoStub: AddTodo;
  addHistoryStub: AddHistory;
  userRepositoryStub: UserRepository;
}

const makeValidUser = (): UserData => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUser();

const makeUserRepositoryStub = (): UserRepository => {
  class UserRepositoryStub implements UserRepository {
    async add(data: AddUserDTO): Promise<UserData> {
      return {
        ...validUser,
        ...data,
      };
    }

    async find(email: string): Promise<UserData | undefined> {
      return {
        ...validUser,
        email,
      };
    }
  }

  return new UserRepositoryStub();
};

const makeAddHistoryStub = (): AddHistory => {
  class AddHistoryStub implements AddHistory {
    async add(data: AddHistoryDTO): Promise<void> {
      console.log(data);
    }
  }

  return new AddHistoryStub();
};

const makeAddTodoStub = (): AddTodo => {
  class AddTodoStub implements AddTodo {
    add(data: AddTodoDTO): Promise<TodoData> {
      return new Promise(resolve =>
        resolve({
          id: faker.random.uuid(),
          description: data.description,
          completed: false,
          user: {
            id: data.user_id,
            name: validUser.name,
            email: validUser.email,
          },
        }),
      );
    }
  }

  return new AddTodoStub();
};

const makeSut = (): SutTypes => {
  const addTodoStub = makeAddTodoStub();
  const addHistoryStub = makeAddHistoryStub();
  const userRepositoryStub = makeUserRepositoryStub();
  const sut = new CreateTodoUseCase(
    addTodoStub,
    addHistoryStub,
    userRepositoryStub,
  );

  return { sut, addTodoStub, addHistoryStub, userRepositoryStub };
};

const makeValidRequest = (): CreateTodoDTO => ({
  description: faker.lorem.sentence(),
  name: validUser.name,
  email: validUser.email,
});

describe('#CreateTodoUseCase', () => {
  it('should return an error if required fields is not provided', async () => {
    const { sut } = makeSut();

    const data = [
      {
        props: {
          description: '',
          name: faker.name.findName(),
          email: faker.internet.email(),
        },
        error: new RequiredValueError('description'),
      },
      {
        props: {
          description: faker.lorem.sentence(),
          name: '',
          email: faker.internet.email(),
        },
        error: new RequiredValueError('name'),
      },
      {
        props: {
          description: faker.lorem.sentence(),
          name: faker.name.findName(),
          email: '',
        },
        error: new RequiredValueError('email'),
      },
      {
        props: {
          description: faker.lorem.sentence(),
          name: faker.name.findName(),
          email: 'invalid_email',
        },
        error: new InvalidEmailError('invalid_email'),
      },
    ];

    await Promise.all(
      data.map(async item => {
        const response = await sut.create(item.props);

        expect(response.isLeft()).toBe(true);
        expect(response.value).toEqual(item.error);
      }),
    );
  });

  it('should call UserRepository.find with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const findSpy = jest.spyOn(userRepositoryStub, 'find');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(findSpy).toHaveBeenCalledWith(requestData.email);
  });

  it('should call UserRepository.add with correct value', async () => {
    const { sut, userRepositoryStub } = makeSut();

    jest.spyOn(userRepositoryStub, 'find').mockResolvedValueOnce(undefined);

    const addSpy = jest.spyOn(userRepositoryStub, 'add');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(addSpy).toHaveBeenCalledWith({
      name: requestData.name,
      email: requestData.email,
    });
  });

  it('should call AddHistory.add with correct value', async () => {
    const { sut, addHistoryStub } = makeSut();

    const addSpy = jest.spyOn(addHistoryStub, 'add');

    const response = await sut.create(makeValidRequest());

    const todo = response.value as TodoData;

    expect(addSpy).toHaveBeenCalledWith({
      type: 'created',
      todo_id: todo.id as string,
    });
  });

  it('should call AddTodo.add with correct value', async () => {
    const { sut, addTodoStub } = makeSut();

    const addSpy = jest.spyOn(addTodoStub, 'add');

    const requestData = makeValidRequest();
    await sut.create(requestData);

    expect(addSpy).toHaveBeenCalledWith({
      description: requestData.description,
      user_id: validUser.id as string,
    });
  });

  it('should throws an error if any dependency throw', async () => {
    const { sut, addTodoStub, userRepositoryStub, addHistoryStub } = makeSut();

    jest.spyOn(addTodoStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest.spyOn(userRepositoryStub, 'find').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest.spyOn(userRepositoryStub, 'find').mockResolvedValueOnce(undefined);
    jest.spyOn(userRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();

    jest.spyOn(addHistoryStub, 'add').mockRejectedValueOnce(new Error());

    await expect(sut.create(makeValidRequest())).rejects.toThrow();
  });

  it('should return Todo on success', async () => {
    const { sut } = makeSut();

    const requestData = makeValidRequest();

    const todoOrError = await sut.create(requestData);

    const todo = todoOrError.value as TodoData;

    expect(todoOrError.isRight()).toBe(true);
    expect(todo.id).toBeTruthy();
    expect(todo.description).toEqual(requestData.description);
    expect(todo.completed).toEqual(false);
    expect(todo.user.id).toEqual(validUser.id);
    expect(todo.user.name).toEqual(validUser.name);
    expect(todo.user.email).toEqual(validUser.email);
  });
});
