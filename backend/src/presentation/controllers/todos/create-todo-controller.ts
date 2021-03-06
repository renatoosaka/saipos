import { ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { badRequest, created, serverError } from '../../helpers/http-helpers';
import { CreateTodo } from '../../../usecases/protocols/create-todo-protocols';

export class CreateTodoController implements Controller {
  constructor(private readonly createTodo: CreateTodo) {}

  async handle({ body }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { description, name, email } = body;

      const todoOrError = await this.createTodo.create({
        description,
        name,
        email,
      });

      if (todoOrError.isLeft()) {
        return badRequest(todoOrError.value);
      }

      return created(todoOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
