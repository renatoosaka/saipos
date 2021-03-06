import faker from 'faker';
import { TodoDescription } from './todo-description';

describe('#TodoDescription Value Object', () => {
  it('should return the correct description', async () => {
    const faker_description = faker.lorem.sentence();

    const descriptionOrError = TodoDescription.create(faker_description);

    expect(descriptionOrError.isLeft()).toBe(false);

    expect(descriptionOrError.isRight()).toBe(true);

    const description: TodoDescription = descriptionOrError.value as TodoDescription;

    expect(description.value).toEqual(faker_description);
  });
});
