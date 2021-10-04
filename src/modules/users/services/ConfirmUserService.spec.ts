import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import ConfirmUserService from './ConfirmUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let confirmUser: ConfirmUserService;

describe('ConfirmUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();

    confirmUser = new ConfirmUserService(
      fakeUsersRepository,
      fakeUsersTokensRepository,
    );
  });

  it('should be able to confirm user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_legal: true,
      is_active: false,
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    await confirmUser.execute({
      token,
    });

    const confirmedUser = await fakeUsersRepository.findById(user.id);

    expect(confirmedUser?.is_active).toBe(true);
  });

  it('should not be able to confirm user with non-existing token', async () => {
    await expect(
      confirmUser.execute({
        token: 'non-existing-token',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to confirm user with non-existing user', async () => {
    const { token } = await fakeUsersTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      confirmUser.execute({
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_legal: true,
      is_active: false,
    });

    const { token } = await fakeUsersTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      confirmUser.execute({
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
