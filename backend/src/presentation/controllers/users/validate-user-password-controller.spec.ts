import faker from 'faker';
import { ok, unauthorized } from '../../helpers/http-helpers';
import { Controller } from '../../protocols/controller-protocol';
import { ValidateUserPasswordController } from './validate-user-password-controller';

interface SutTypes {
  sut: Controller;
}

const makeSut = (): SutTypes => {
  const sut = new ValidateUserPasswordController();

  return { sut };
};

describe('#ValidateUserPassword Controller', () => {
  it('should return 401 if wrong password is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      body: { password: faker.random.alpha({ count: 10 }) },
    });

    expect(response).toEqual(unauthorized());
  });

  it('should return 200 if correct password is provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({
      body: { password: 'TrabalheNaSaipos' },
    });

    expect(response).toEqual(ok({ ok: 'OK' }));
  });
});
