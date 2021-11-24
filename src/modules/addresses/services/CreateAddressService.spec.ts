import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeAddressesRepository from '../repositories/fakes/FakeAddressesRepository';
import CreateAddressService from './CreateAddressService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAddressesRepository: FakeAddressesRepository;
let createAddress: CreateAddressService;

describe('CreateAddress', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAddressesRepository = new FakeAddressesRepository();

    createAddress = new CreateAddressService(
      fakeUsersRepository,
      fakeAddressesRepository,
    );
  });

  it('should be able to create a address', async () => {
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

    const address = await createAddress.execute({
      user_id: user.id,
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    })

    expect(address).toHaveProperty('id');
  });

  it('should not be able to create an address on an account that is not yours', async () => {
    await expect(
      createAddress.execute({
        user_id: 'user_id',
        zip_code: '12211020',
        neighborhood: 'Hudavib',
        city: 'Docomer',
        state: 'WP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an address with incorrect zip code formatting', async () => {
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
      createAddress.execute({
        user_id: user.id,
        zip_code: '12.211-020',
        neighborhood: 'Hudavib',
        city: 'Docomer',
        state: 'WP',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
