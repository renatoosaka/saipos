import { TodoData } from '../../../domain/entities/todos/todo-data';

export interface UpdateTodoDTO {
  id: string;
  completed: boolean;
}

export interface UpdateTodo {
  update(data: UpdateTodoDTO): Promise<TodoData>;
}
