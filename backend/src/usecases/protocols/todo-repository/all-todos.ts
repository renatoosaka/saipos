import { TodoData } from '../../../domain/entities/todos/todo-data';

export interface AllTodos {
  all(): Promise<TodoData[]>;
}
