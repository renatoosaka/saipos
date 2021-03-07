import { AddTodo } from './add-todo';
import { AllTodos } from './all-todos';
import { FindTodoByID } from './find-todo-by-id';
import { UpdateTodo } from './update-todo';

export * from './add-todo';
export * from './all-todos';
export * from './update-todo';
export * from './find-todo-by-id';

export interface TodoRepository
  extends AddTodo,
    AllTodos,
    UpdateTodo,
    FindTodoByID {}
