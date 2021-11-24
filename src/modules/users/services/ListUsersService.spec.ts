import FakeAddressesRepository from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAddressesRepository: FakeAddressesRepository;
let listUsers: ListUsersService;

describe('ListUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAddressesRepository = new FakeAddressesRepository();

    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all users', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });

    const allUsers = await listUsers.execute({
      user_id: user.id,
    });

    expect(allUsers).not.toEqual([]);
  });

  it('should be able to list all users by own information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });

    const allUsers = await listUsers.execute({
      user_id: user.id,
      offset: 0,
      limit: 10,
      filters: {
        user: 'John Doe',
      },
    });

    expect(allUsers).not.toEqual([]);
  });

  it('should be able to list all users by address information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12988239090',
      document: '22287634090',
      cnpj: '',
      is_legal: false,
    });

    await fakeAddressesRepository.create({
      user_id: user.id,
      zip_code: '12222890',
      neighborhood: 'Cousain',
      city: 'Jukuvav',
      state: 'NJ',
    });


    const allUsers = await listUsers.execute({
      user_id: user.id,
      offset: 0,
      limit: 10,
      filters: {
        address: 'Cousain',
      },
    });

    expect(allUsers).not.toEqual([]);
  });
});
