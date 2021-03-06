import { AllTodos } from '../protocols/todo-repository';
import { TodoData } from '../../domain/entities/todos/todo-data';
import { ShowAllTodos } from '../protocols/show-all-todos-protocol';

export class ShowAllTodosUseCase implements ShowAllTodos {
  constructor(private readonly allTodos: AllTodos) {}

  async all(): Promise<TodoData[]> {
    return this.allTodos.all();
  }
}
