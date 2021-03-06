import { CreateTodoUseCase } from '../../../usecases/todos/create-todo-usecase';
import { Controller } from '../../../presentation/protocols/controller-protocol';
import { TodoMySQLRepository } from '../../../data/repository/mysql/todo-mysql-repository';
import { UserMySQLRepository } from '../../../data/repository/mysql/user-mysql-repository';
import { CreateTodoController } from '../../../presentation/controllers/todos/create-todo-controller';

export const createTodoControllerFactory = (): Controller => {
  const todoRepository = new TodoMySQLRepository();
  const userRepository = new UserMySQLRepository();
  const createTodo = new CreateTodoUseCase(todoRepository, userRepository);

  return new CreateTodoController(createTodo);
};
