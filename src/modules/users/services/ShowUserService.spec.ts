import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import ShowUserService from './ShowUserService';

let fakeUsersRepository: FakeUsersRepository;
let showUser: ShowUserService;

describe('ShowUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to find one user by id', async () => {
    const user = fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });


    await showUser.execute((await user).id);

    expect((await user).email).toBe('johndoe@example.com');
    expect((await user).password).toBe('123456');
  });

  it('should not find a non-existing user', async () => {
    await expect(
      showUser.execute('non-existent user'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
