import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersTokensRepository from '../repositories/fakes/FakeUsersTokensRepository';
import UpdateConfirmUserTokenService from './UpdateConfirmUserTokenService';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersTokensRepository: FakeUsersTokensRepository;
let fakeMailProvider: FakeMailProvider;
let updateConfirmUserToken: UpdateConfirmUserTokenService;

describe('UpdateConfirmUserToken', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUsersTokensRepository = new FakeUsersTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    updateConfirmUserToken = new UpdateConfirmUserTokenService(
      fakeUsersRepository,
      fakeUsersTokensRepository,
      fakeMailProvider,
    );
  });

  it('should be able to update confirm user token using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

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

    const tokenUser = await fakeUsersTokensRepository.generate(user.id);

    await updateConfirmUserToken.execute(tokenUser.id);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to update a non-existing user token', async () => {
    await expect(
      updateConfirmUserToken.execute('non-existing user token'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existing user', async () => {
    const tokenUser = await fakeUsersTokensRepository.generate(
      'non-existing-user',
    );

    await expect(
      updateConfirmUserToken.execute(tokenUser.id),
    ).rejects.toBeInstanceOf(AppError);
  });
});
