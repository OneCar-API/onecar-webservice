import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('ListUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });

    const allUsers = await listUsers.execute();

    expect(allUsers).toEqual([user1, user2]);
  });
});
