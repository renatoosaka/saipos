import faker from 'faker';
import { Todo } from './todo-entity';
import { RequiredValueError } from '../../errors';

describe('#Todo', () => {
  it('should return a RequiredValueError if does not provided required values', () => {
    const todoOrError = Todo.create({
      description: '',
      user: {
        name: faker.name.findName(),
        email: faker.internet.email(),
      },
    });

    expect(todoOrError.isLeft()).toEqual(true);
    expect(todoOrError.isRight()).toEqual(false);
    expect(todoOrError.value).toEqual(new RequiredValueError('description'));
  });

  it('should return a todo on success', () => {
    const todoOrError = Todo.create({
      description: faker.lorem.sentence(),
      user: {
        name: faker.name.findName(),
        email: faker.internet.email(),
      },
    });

    expect(todoOrError.isRight()).toEqual(true);
    expect(todoOrError.isLeft()).toEqual(false);
  });
});
