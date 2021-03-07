import { Controller } from '../../../presentation/protocols/controller-protocol';
import { TodoMySQLRepository } from '../../../data/repository/mysql/todo-mysql-repository';
import { HistoryMySQLRepository } from '../../../data/repository/mysql/history-mysql-repository';
import { UpdateTodoStatusController } from '../../../presentation/controllers/todos/update-todo-status-controller';
import { UpdateTodoStatusUseCase } from '../../../usecases/todos/update-todo-status-usecase';

export const updateTodoStatusControllerFactory = (): Controller => {
  const todoRepository = new TodoMySQLRepository();
  const historyRepository = new HistoryMySQLRepository();
  const updateTodoStatus = new UpdateTodoStatusUseCase(
    todoRepository,
    historyRepository,
  );

  return new UpdateTodoStatusController(updateTodoStatus);
};
