import { RequiredValueError } from '../../errors';
import { Either, left, right } from '../../../shared';

export class TodoDescription {
  private constructor(private readonly description: string) {
    Object.freeze(this);
  }

  get value(): string {
    return this.description;
  }

  static create(
    description: string,
  ): Either<RequiredValueError, TodoDescription> {
    if (!description) {
      return left(new RequiredValueError('description'));
    }

    return right(new TodoDescription(description));
  }
}
