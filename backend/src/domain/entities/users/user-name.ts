import { RequiredValueError } from '../../errors';
import { Either, left, right } from '../../../shared';

export class UserName {
  private constructor(private readonly name: string) {
    Object.freeze(this);
  }

  get value(): string {
    return this.name;
  }

  static create(name: string): Either<RequiredValueError, UserName> {
    if (!name) {
      return left(new RequiredValueError('name'));
    }

    return right(new UserName(name));
  }
}
