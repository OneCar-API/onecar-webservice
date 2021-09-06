import { getRepository, Repository } from 'typeorm';

import IAddressesRepository from '@modules/addresses/repositories/IAddressesRepository';
import ICreateAddressDTO from '@modules/addresses/dtos/ICreateAddressDTO';
import Address from '../entities/Address';

class AddressesRepository implements IAddressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async create({
    user_id,
    zip_code,
    neighborhood,
    city,
    state,
  }: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create({
      user_id,
      zip_code,
      neighborhood,
      city,
      state,
    });

    await this.ormRepository.save(address);

    return address;
  }
}

export default AddressesRepository;
