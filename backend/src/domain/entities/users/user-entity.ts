import { UserData } from '.';
import { UserName } from './user-name';
import { UserEmail } from './user-email';
import { Either, left, right } from '../../../shared';
import { InvalidEmailError, RequiredValueError } from '../../errors';

export class User {
  private constructor(
    private readonly name: UserName,
    private readonly email: UserEmail,
  ) {
    Object.freeze(this);
  }

  static create(
    data: UserData,
  ): Either<InvalidEmailError | RequiredValueError, User> {
    const nameOrError = UserName.create(data.name);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    const emailOrError = UserEmail.create(data.email);

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    const name: UserName = nameOrError.value;
    const email: UserEmail = emailOrError.value;

    return right(new User(name, email));
  }
}
