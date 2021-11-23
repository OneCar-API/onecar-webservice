import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let deleteUser: DeleteUserService;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    deleteUser = new DeleteUserService(
      fakeUsersRepository,
    );
  });

  it('should be able to delete an user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
    });

    const userDeleted = await deleteUser.execute({
      user_id: user.id,
    });

    expect(userDeleted).toBe(undefined);
  });

  it('should not be able to delete a non-existent user', async () => {
    await expect(
      deleteUser.execute({
        user_id: 'non-existent user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
