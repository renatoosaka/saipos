import { AddTodo } from './add-todo';
import { AllTodos } from './all-todos';

export * from './add-todo';
export * from './all-todos';

export interface TodoRepository extends AddTodo, AllTodos {}
