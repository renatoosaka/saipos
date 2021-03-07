import { left, right } from '../../shared';
import { TodoNotFoundError } from '../errors';
import { TodoRepository } from '../protocols/todo-repository';
import { AddHistory } from '../protocols/history-repository';
import {
  UpdateTodoStatus,
  UpdateTodoStatusDTO,
  UpdateTodoStatusResponse,
} from '../protocols/update-todo-status-protocols';

export class UpdateTodoStatusUseCase implements UpdateTodoStatus {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly addHistory: AddHistory,
  ) {}

  async update(data: UpdateTodoStatusDTO): Promise<UpdateTodoStatusResponse> {
    const { completed, id } = data;

    const todo_exists = await this.todoRepository.find(id);

    if (!todo_exists) {
      return left(new TodoNotFoundError(id));
    }

    const todo = await this.todoRepository.update({
      id,
      completed,
    });

    await this.addHistory.add({
      todo_id: id,
      type: completed ? 'completed' : 'reopened',
    });

    return right(todo);
  }
}
