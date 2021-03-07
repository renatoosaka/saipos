import faker from 'faker';
import { left, right } from '../../../shared';
import { HTTPRequest } from '../../protocols/http-protocol';
import { Controller } from '../../protocols/controller-protocol';
import {
  CreateTodo,
  CreateTodoDTO,
  CreateTodoResponse,
} from '../../../usecases/protocols/create-todo-protocols';
import { CreateTodoController } from './create-todo-controller';
import {
  UpdateTodoStatus,
  UpdateTodoStatusDTO,
  UpdateTodoStatusResponse,
} from '../../../usecases/protocols/update-todo-status-protocols';
import { UpdateTodoStatusController } from './update-todo-status-controller';
import { TodoNotFoundError } from '../../../usecases/errors';

interface SutTypes {
  sut: Controller;
  updateTodoStatusStub: UpdateTodoStatus;
}

const makeValidUser = () => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  email: faker.internet.email(),
});

const validUser = makeValidUser();

const makeValidTodoData = () => ({
  id: faker.random.uuid(),
  description: faker.lorem.sentence(),
  completed: false,
  user: validUser,
});

const validTodo = makeValidTodoData();

const makeUpdateTodoStatusStub = (): UpdateTodoStatus => {
  class UpdateTodoStatusStub implements UpdateTodoStatus {
    async update(data: UpdateTodoStatusDTO): Promise<UpdateTodoStatusResponse> {
      return new Promise(resolve =>
        resolve(
          right({ ...validTodo, id: data.id, completed: data.completed }),
        ),
      );
    }
  }

  return new UpdateTodoStatusStub();
};

const makeSut = (): SutTypes => {
  const updateTodoStatusStub = makeUpdateTodoStatusStub();
  const sut = new UpdateTodoStatusController(updateTodoStatusStub);

  return {
    sut,
    updateTodoStatusStub,
  };
};

const makeValidRequest = (): HTTPRequest => ({
  params: {
    id: validTodo.id,
  },
  body: {
    completed: true,
  },
});

describe('UpdateTodoStatus Controller', () => {
  it('should call UpdateTodoStatus usecase with correct value', async () => {
    const { sut, updateTodoStatusStub } = makeSut();

    const createSpy = jest.spyOn(updateTodoStatusStub, 'update');

    const request = makeValidRequest();

    await sut.handle(request);

    expect(createSpy).toHaveBeenCalledWith({
      id: request.params.id,
      completed: request.body.completed,
    });
  });

  it('should return 404 if todo not found', async () => {
    const { sut, updateTodoStatusStub } = makeSut();

    jest
      .spyOn(updateTodoStatusStub, 'update')
      .mockResolvedValueOnce(left(new TodoNotFoundError(validTodo.id)));

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(404);
  });

  it('should return 500 if usecase throws an error', async () => {
    const { sut, updateTodoStatusStub } = makeSut();

    jest
      .spyOn(updateTodoStatusStub, 'update')
      .mockRejectedValueOnce(new Error());

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(500);
  });

  it('should return 200 on success', async () => {
    const { sut } = makeSut();

    const request = makeValidRequest();

    const response = await sut.handle(request);

    expect(response.status_code).toEqual(200);
    expect(response.body.id).toEqual(request.params.id);
    expect(response.body.description).toEqual(validTodo.description);
    expect(response.body.user.name).toEqual(validUser.name);
    expect(response.body.user.email).toEqual(validUser.email);
    expect(response.body.completed).toEqual(true);
  });
});
