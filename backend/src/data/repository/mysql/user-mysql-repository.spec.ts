import faker from 'faker';
import { MySQLDB } from '../../../infra/database/mysql';
import { UserMySQLRepository } from './user-mysql-repository';
import {
  AddUserDTO,
  UserRepository,
} from '../../../usecases/protocols/user-repository';

const makeSut = (): UserRepository => {
  return new UserMySQLRepository();
};

const makeValidCreateData = (): AddUserDTO => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
});

describe('#UserMySQLRepository', () => {
  beforeAll(async () => {
    await MySQLDB.connect({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: 'saipos_todo_test',
      port: 3306,
    });
  });

  afterAll(async () => {
    await MySQLDB.client.execute('DELETE FROM users;');
    await MySQLDB.disconnect();
  });

  it('should return a USER on success', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    const user = await sut.add(createDataDTO);

    expect(user).toBeTruthy();
    expect(user.id).toBeTruthy();
    expect(user.name).toEqual(createDataDTO.name);
    expect(user.email).toEqual(createDataDTO.email);
  });

  it('should return a user with existing email', async () => {
    const sut = makeSut();

    const createDataDTO = makeValidCreateData();

    await sut.add(createDataDTO);

    const user = await sut.find(createDataDTO.email);

    expect(user).toBeTruthy();
    expect(user?.id).toBeTruthy();
    expect(user?.name).toEqual(createDataDTO.name);
    expect(user?.email).toEqual(createDataDTO.email);
  });

  it('should return undefined if no user was found', async () => {
    const sut = makeSut();

    const user = await sut.find(faker.internet.email());

    expect(user).toBeFalsy();
  });
});
