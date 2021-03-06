import faker from 'faker';
import { right } from '../../../shared';
import { HTTPRequest } from '../../protocols/http-protocol';
import { Controller } from '../../protocols/controller-protocol';
import {
  CreateTodo,
  CreateTodoDTO,
  CreateTodoResponse,
} from '../../../usecases/protocols/create-todo-protocols';
import { CreateTodoController } from './create-todo-controller';

interface SutTypes {
  sut: Controller;
  createTodoStub: CreateTodo;
}

const makeCreateTodoStub = (): CreateTodo => {
  class CreateTodoStub implements CreateTodo {
    async create(data: CreateTodoDTO): Promise<CreateTodoResponse> {
      return new Promise(resolve =>
        resolve(
          right({
            id: faker.random.uuid(),
            description: data.description,
            completed: false,
            user: {
              id: faker.random.uuid(),
              name: data.name,
              email: data.email,
            },
          }),
        ),
      );
    }
  }

  return new CreateTodoStub();
};

const makeSut = (): SutTypes => {
  const createTodoStub = makeCreateTodoStub();
  const sut = new CreateTodoController(createTodoStub);

  return {
    sut,
    createTodoStub,
  };
};

const makeValidRequest = (): HTTPRequest => ({
  body: {
    description: faker.lorem.sentence(),
    name: faker.name.findName(),
    email: faker.internet.email(),
  },
});

describe('CreateProduct Controller', () => {
  it('should call CreateTodo usecase with correct value', async () => {
    const { sut, createTodoStub } = makeSut();

    const createSpy = jest.spyOn(createTodoStub, 'create');

    const request = makeValidRequest();

    await sut.handle(request);

    expect(createSpy).toHaveBeenCalledWith({
      description: request.body.description,
      name: request.body.name,
      email: request.body.email,
    });
  });

  it('should return 500 if usecase throws an error', async () => {
    const { sut, createTodoStub } = makeSut();

    jest.spyOn(createTodoStub, 'create').mockRejectedValueOnce(new Error());

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(500);
  });

  it('should return 201 on success', async () => {
    const { sut } = makeSut();

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(201);
    expect(response.body.id).toBeTruthy();
    expect(response.body.description).toEqual(request.body.description);
    expect(response.body.user.name).toEqual(request.body.name);
    expect(response.body.user.email).toEqual(request.body.email);
    expect(response.body.completed).toEqual(false);
  });
});
