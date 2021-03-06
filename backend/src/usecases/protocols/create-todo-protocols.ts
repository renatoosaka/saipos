import { Either } from '../../shared';
import { TodoData } from '../../domain/entities/todos/todo-data';
import { InvalidEmailError, RequiredValueError } from '../../domain/errors';

export interface CreateTodoDTO {
  description: string;
  name: string;
  email: string;
}

export type CreateTodoResponse = Either<
  RequiredValueError | InvalidEmailError,
  TodoData
>;

export interface CreateTodo {
  create(data: CreateTodoDTO): Promise<CreateTodoResponse>;
}
