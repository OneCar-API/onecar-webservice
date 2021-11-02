import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAddressesRepository from '../repositories/fakes/FakeAddressesRepository';
import UpdateAddressService from './UpdateAddressService';
import addressesRouter from '../infra/http/routes/addresses.routes';

let fakeUsersRepository: FakeUsersRepository;
let fakeAddressesRepository: FakeAddressesRepository;
let updateAddress: UpdateAddressService;

describe('UpdateAddress', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAddressesRepository = new FakeAddressesRepository();

    updateAddress = new UpdateAddressService(
      fakeUsersRepository,
      fakeAddressesRepository,
    );
  });

  it('should be able to update a address', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_active: false,
      is_legal: true,
    });

    const address = await fakeAddressesRepository.create({
      user_id: user.id,
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    const updatedAddress = await updateAddress.execute({
      user_id: user.id,
      address_id: address.id,
      zip_code: '12211020',
      neighborhood: 'RijbaezTujopu',
      city: 'Botdudoc',
      state: 'LS',
    });

    expect(updatedAddress.state).toBe('LS');
  });

  it('should not be able to update an address on an account that is not yours', async () => {
    const address = await fakeAddressesRepository.create({
      user_id: 'user_id',
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    await expect(
      updateAddress.execute({
        user_id: 'user_id',
        address_id: address.id,
        zip_code: '12211020',
        neighborhood: 'Hudavib',
        city: 'Docomer',
        state: 'WP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a non-existent address', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_active: false,
      is_legal: true,
    });

    await expect(
      updateAddress.execute({
        user_id: user.id,
        address_id: 'non-existent address',
        zip_code: '12211020',
        neighborhood: 'Hudavib',
        city: 'Docomer',
        state: 'WP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update an address with incorrect zip code formatting', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_active: false,
      is_legal: true,
    });

    const address = await fakeAddressesRepository.create({
      user_id: user.id,
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    });

    await expect(
      updateAddress.execute({
        user_id: user.id,
        address_id: address.id,
        zip_code: '12.211-020',
        neighborhood: 'Hudavib',
        city: 'Docomer',
        state: 'WP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
