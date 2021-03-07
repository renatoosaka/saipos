import { AddHistory } from './add-history';
import { CountTodoTypeHistory } from './count-todo-type-history';

export * from './add-history';
export * from './count-todo-type-history';

export interface HistoryRepository extends AddHistory, CountTodoTypeHistory {}
