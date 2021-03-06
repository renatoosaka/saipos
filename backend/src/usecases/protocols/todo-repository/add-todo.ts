import { TodoData } from '../../../domain/entities/todos/todo-data';

export interface AddTodoDTO {
  description: string;
  user_id: string;
}

export interface AddTodo {
  add(data: AddTodoDTO): Promise<TodoData>;
}
