import validator from 'validator';
import { Either, left, right } from '../../../shared';
import { InvalidEmailError, RequiredValueError } from '../../errors';

export class UserEmail {
  private constructor(private readonly email: string) {
    Object.freeze(this);
  }

  get value(): string {
    return this.email;
  }

  static create(
    email: string,
  ): Either<RequiredValueError | InvalidEmailError, UserEmail> {
    if (!email) {
      return left(new RequiredValueError('email'));
    }

    if (!validator.isEmail(email)) {
      return left(new InvalidEmailError(email));
    }

    return right(new UserEmail(email));
  }
}
