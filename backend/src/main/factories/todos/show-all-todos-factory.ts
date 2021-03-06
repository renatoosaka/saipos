import { Controller } from '../../../presentation/protocols/controller-protocol';
import { ShowAllTodosUseCase } from '../../../usecases/todos/show-all-todos-usecase';
import { TodoMySQLRepository } from '../../../data/repository/mysql/todo-mysql-repository';
import { ShowAllTodosController } from '../../../presentation/controllers/todos/show-all-todos-controller';

export const showAllTodosControllerFactory = (): Controller => {
  const todoRepository = new TodoMySQLRepository();
  const showAllTodos = new ShowAllTodosUseCase(todoRepository);

  return new ShowAllTodosController(showAllTodos);
};
