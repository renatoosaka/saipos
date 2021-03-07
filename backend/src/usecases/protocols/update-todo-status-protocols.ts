import { Either } from '../../shared';
import { TodoNotFoundError } from '../errors';
import { RequiredValueError } from '../../domain/errors';
import { TodoData } from '../../domain/entities/todos/todo-data';

export interface UpdateTodoStatusDTO {
  id: string;
  completed: boolean;
}

export type UpdateTodoStatusResponse = Either<
  RequiredValueError | TodoNotFoundError,
  TodoData
>;

export interface UpdateTodoStatus {
  update(data: UpdateTodoStatusDTO): Promise<UpdateTodoStatusResponse>;
}
