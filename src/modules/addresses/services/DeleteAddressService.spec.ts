import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import DeleteAddressService from './DeleteAddressService';
import FakeAddressesRepository from '../repositories/fakes/FakeAddressesRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeAddressesRepository: FakeAddressesRepository;
let deleteAddress: DeleteAddressService;

describe('DeleteAddresses', () => {
  beforeEach(() => {
    fakeAddressesRepository = new FakeAddressesRepository();
    fakeUsersRepository = new FakeUsersRepository();

    deleteAddress = new DeleteAddressService(
      fakeAddressesRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to delete an address', async () => {
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

    const deletedAddress = await deleteAddress.execute({
      user_id: user.id,
      address_id: address.id,
    });

    expect(deletedAddress).toBe(undefined);
  });

  it('should not be able to delete an address on an account that is not yours', async () => {
    const address = await fakeAddressesRepository.create({
      user_id: 'user_id',
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    await expect(
      deleteAddress.execute({
        user_id: 'user_id',
        address_id: address.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete an address that does not exist', async () => {
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
      deleteAddress.execute({
        user_id: user.id,
        address_id: 'non-existent address',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
