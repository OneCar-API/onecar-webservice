import FakeAddressesRepository from '@modules/addresses/repositories/fakes/FakeAddressesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListAddressesService from './ListAddressesService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAddressesRepository: FakeAddressesRepository;
let listAddresses: ListAddressesService;

describe('ListAddresses', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAddressesRepository = new FakeAddressesRepository();

    listAddresses = new ListAddressesService(fakeAddressesRepository);
  });

  it('should be able to list all addresses', async () => {
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

    fakeAddressesRepository.create({
      user_id: user.id,
      zip_code: '12211020',
      neighborhood: 'Hudavib',
      city: 'Docomer',
      state: 'WP',
    })

    const allAddresses = await listAddresses.execute({
      offset: 0,
      limit: 20,
    });

    expect(allAddresses).not.toEqual([]);
  });
});
