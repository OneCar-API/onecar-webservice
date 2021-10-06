import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeUsersTokensRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });

  it('should be able to create a user', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another user', async () => {
    await createUser.execute({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        nickname: 'john.doe',
        password: '123456',
        email: 'johndoe@example.com',
        phone: '12987906565',
        document: '22287634090',
        cnpj: '42800967000134',

      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
