import { v4 as uuidV4 } from 'uuid';

import ICreateAddressDTO from '@modules/addresses/dtos/ICreateAddressDTO';
import IAddressesRepository from '../IAddressesRepository';

import Address from '../../infra/typeorm/entities/Address';

class FakeAddressesRepository implements IAddressesRepository {
  addresses: Address[] = [];

  public async create({
    zip_code,
    neighborhood,
    city,
    state,
  }: ICreateAddressDTO): Promise<Address> {
    const address = new Address();

    Object.assign(address, {
      id: uuidV4(),
      zip_code,
      neighborhood,
      city,
      state,
    });

    this.addresses.push(address);

    return address;
  }
}

export default FakeAddressesRepository;
