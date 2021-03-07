import { left, right } from '../../shared';
import { TodoLimitReopenError, TodoNotFoundError } from '../errors';
import { TodoRepository } from '../protocols/todo-repository';
import { HistoryRepository } from '../protocols/history-repository';
import {
  UpdateTodoStatus,
  UpdateTodoStatusDTO,
  UpdateTodoStatusResponse,
} from '../protocols/update-todo-status-protocols';

export class UpdateTodoStatusUseCase implements UpdateTodoStatus {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  async update(data: UpdateTodoStatusDTO): Promise<UpdateTodoStatusResponse> {
    const { completed, id } = data;

    const todo_exists = await this.todoRepository.find(id);

    if (!todo_exists) {
      return left(new TodoNotFoundError(id));
    }

    if (!completed) {
      const reopen_count = await this.historyRepository.count({
        todo_id: id,
        type: 'reopened',
      });

      if (reopen_count >= 2) {
        return left(new TodoLimitReopenError(id));
      }
    }

    const todo = await this.todoRepository.update({
      id,
      completed,
    });

    await this.historyRepository.add({
      todo_id: id,
      type: completed ? 'completed' : 'reopened',
    });

    return right(todo);
  }
}
