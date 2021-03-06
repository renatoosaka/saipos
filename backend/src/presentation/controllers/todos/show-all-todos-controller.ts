import { ServerError } from '../../errors';
import { HTTPResponse } from '../../protocols/http-protocol';
import { ok, serverError } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller-protocol';
import { ShowAllTodos } from '../../../usecases/protocols/show-all-todos-protocol';

export class ShowAllTodosController implements Controller {
  constructor(private readonly showAllTodos: ShowAllTodos) {}

  async handle(): Promise<HTTPResponse> {
    try {
      const todos = await this.showAllTodos.all();

      return ok(todos);
    } catch (error) {
      return serverError(new ServerError(error.stack));
    }
  }
}
