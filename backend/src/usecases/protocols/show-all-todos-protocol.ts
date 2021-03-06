import { TodoData } from '../../domain/entities/todos/todo-data';

export interface ShowAllTodos {
  all(): Promise<TodoData[]>;
}
