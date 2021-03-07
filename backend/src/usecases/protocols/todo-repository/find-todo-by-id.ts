import { TodoData } from '../../../domain/entities/todos/todo-data';

export interface FindTodoByID {
  find(id: string): Promise<TodoData | undefined>;
}
