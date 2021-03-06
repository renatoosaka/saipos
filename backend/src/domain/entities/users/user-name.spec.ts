import faker from 'faker';
import { UserName as sut, UserName } from './user-name';

describe('#UserName Value Object', () => {
  it('should return the correct name', async () => {
    const faker_name = faker.name.findName();

    const nameOrError = sut.create(faker_name);

    expect(nameOrError.isLeft()).toBe(false);

    expect(nameOrError.isRight()).toBe(true);

    const name: UserName = nameOrError.value as UserName;

    expect(name.value).toEqual(faker_name);
  });
});
