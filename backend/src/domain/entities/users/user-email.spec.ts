import faker from 'faker';
import { UserEmail } from './user-email';

describe('#UserName Value Object', () => {
  it('should return the correct name', async () => {
    const faker_email = faker.internet.email();

    const sut = UserEmail;

    const emailOrError = sut.create(faker_email);

    expect(emailOrError.isLeft()).toBe(false);

    expect(emailOrError.isRight()).toBe(true);

    const email: UserEmail = emailOrError.value as UserEmail;

    expect(email.value).toEqual(faker_email);
  });
});
