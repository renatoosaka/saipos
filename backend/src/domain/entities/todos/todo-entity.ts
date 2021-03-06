import { UserData } from '../users';
import { TodoData } from './todo-data';
import { RequiredValueError } from '../../errors';
import { TodoDescription } from './todo-description';
import { Either, left, right } from '../../../shared';

export class Todo {
  private constructor(
    private readonly description: TodoDescription,
    private readonly user: UserData,
  ) {
    Object.freeze(this);
  }

  static create(data: TodoData): Either<RequiredValueError, Todo> {
    const descriptionOrError = TodoDescription.create(data.description);

    if (descriptionOrError.isLeft()) {
      return left(descriptionOrError.value);
    }

    const description: TodoDescription = descriptionOrError.value;

    const { user } = data;

    return right(new Todo(description, user));
  }
}
