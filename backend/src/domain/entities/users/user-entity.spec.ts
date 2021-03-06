import faker from 'faker';
import { User, UserData } from '.';
import { Either } from '../../../shared';
import { InvalidEmailError, RequiredValueError } from '../../errors';

describe('#User', () => {
  it('should return a RequiredValueError if does not provided required values', () => {
    let userOrError: Either<InvalidEmailError | RequiredValueError, User>;

    userOrError = User.create({
      name: '',
      email: faker.internet.email(),
    });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.isRight()).toEqual(false);
    expect(userOrError.value).toEqual(new RequiredValueError('name'));

    userOrError = User.create({
      name: faker.name.findName(),
      email: '',
    });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.isRight()).toEqual(false);
    expect(userOrError.value).toEqual(new RequiredValueError('email'));
  });

  it('should return InvalidEmailError if an invalid email is provided', () => {
    const userOrError = User.create({
      name: faker.name.findName(),
      email: 'invalid_email',
    });

    expect(userOrError.isLeft()).toEqual(true);
    expect(userOrError.isRight()).toEqual(false);
    expect(userOrError.value).toEqual(new InvalidEmailError('invalid_email'));
  });

  it('should return a user on success', () => {
    const userData: UserData = {
      name: faker.name.findName(),
      email: faker.internet.email(),
    };

    const userOrError = User.create(userData);

    expect(userOrError.isRight()).toEqual(true);
    expect(userOrError.isLeft()).toEqual(false);
  });
});
