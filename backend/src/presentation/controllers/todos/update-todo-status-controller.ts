import { ServerError } from '../../errors';
import { Controller } from '../../protocols/controller-protocol';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '../../helpers/http-helpers';
import { HTTPRequest, HTTPResponse } from '../../protocols/http-protocol';
import { UpdateTodoStatus } from '../../../usecases/protocols/update-todo-status-protocols';
import { TodoNotFoundError } from '../../../usecases/errors';
import { IO } from '../../../infra/socket';

export class UpdateTodoStatusController implements Controller {
  constructor(private readonly updaTodoStatus: UpdateTodoStatus) {}

  async handle({ body, params }: HTTPRequest): Promise<HTTPResponse> {
    try {
      const { id } = params;
      const { completed } = body;

      const todoOrError = await this.updaTodoStatus.update({
        id,
        completed,
      });

      if (todoOrError.isLeft()) {
        if (todoOrError.value instanceof TodoNotFoundError) {
          return notFound(todoOrError.value);
        }

        return badRequest(todoOrError.value);
      }

      if (IO.client) {
        IO.client.emit('todo_updated', todoOrError.value);
      }

      return ok(todoOrError.value);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
