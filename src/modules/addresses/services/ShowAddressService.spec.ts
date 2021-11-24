import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import FakeAddressesRepository from '../repositories/fakes/FakeAddressesRepository';

import ShowAddressService from './ShowAddressService';

let fakeAddressesRepository: FakeAddressesRepository;
let fakeUsersRepository: FakeUsersRepository;
let showAddress: ShowAddressService;

describe('ShowAddress', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    showAddress = new ShowAddressService(
      fakeAddressesRepository,
      fakeUsersRepository
    );
  });

  it('should be able to find one address by id', async () => {
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

    const address = await fakeAddressesRepository.create({
      user_id: user.id,
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    await showAddress.execute(user.id, address.id);

    expect(address.id).toBe(address.id);
  });

  it('should not be able to view the missing address', async () => {
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

    await expect(
      showAddress.execute(user.id, 'non-existent address'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to view the address of a non-existent user', async () => {
    const address = await fakeAddressesRepository.create({
      user_id: 'non-existent user',
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    await expect(
      showAddress.execute('non-existent user', address.id),
    ).rejects.toBeInstanceOf(AppError);
  });
});
