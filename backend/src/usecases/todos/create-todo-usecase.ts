import { left, right } from '../../shared';
import { AddTodo } from '../protocols/todo-repository';
import { User, UserData } from '../../domain/entities/users';
import { UserRepository } from '../protocols/user-repository';
import { Todo } from '../../domain/entities/todos/todo-entity';
import {
  CreateTodo,
  CreateTodoDTO,
  CreateTodoResponse,
} from '../protocols/create-todo-protocols';

export class CreateTodoUseCase implements CreateTodo {
  constructor(
    private readonly addTodo: AddTodo,
    private readonly userRepository: UserRepository,
  ) {}

  async create(data: CreateTodoDTO): Promise<CreateTodoResponse> {
    const { description, name, email } = data;

    const userOrError = User.create({
      name,
      email,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const todoOrError = Todo.create({
      description,
      user: {
        name,
        email,
      },
    });

    if (todoOrError.isLeft()) {
      return left(todoOrError.value);
    }

    let user: UserData | undefined;

    user = await this.userRepository.find(email);

    if (!user) {
      user = await this.userRepository.add({ name, email });
    }

    const todo_created = await this.addTodo.add({
      description,
      user_id: user.id as string,
    });

    return right(todo_created);
  }
}
