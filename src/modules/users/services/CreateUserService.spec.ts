import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      document: '22287634090',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
    await createUser.execute({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      document: '22287634090',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        nickname: 'john.doe',
        password: '123456',
        email: 'johndoe@example.com',
        document: '22287634090',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
