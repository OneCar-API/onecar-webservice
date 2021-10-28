import { v4 as uuidV4 } from 'uuid';

import ICreateAddressDTO from '@modules/addresses/dtos/ICreateAddressDTO';
import IAddressesRepository from '../IAddressesRepository';

import Address from '../../infra/typeorm/entities/Address';
import IUpdateAddressDTO from '@modules/addresses/dtos/IUpdateAddressDTO';

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

  public async findAll(
    offset?: number,
    limit?: number,
  ): Promise<[Address[], number]> {
    const findAddresses = this.addresses.filter(address => {
      if (
        (offset && offset === offset) ||
        (limit && limit === limit)
      ) {
        return address;
      }

      return null;
    });

    const totalAddresses = findAddresses.length;

    return [findAddresses, totalAddresses];
  }

  public async findById(
    id: string
  ): Promise<Address | undefined> {
    const findAddress = this.addresses.find(
      address => address.id === id
    );

    return findAddress;
  }

  public async update({
    address_id,
    zip_code,
    neighborhood,
    city,
    state,
  }: IUpdateAddressDTO): Promise<Address> {
    const findAddress = this.addresses.find(address => address.id === address_id);

    const updateAddress = Object.assign(findAddress, {
      zip_code,
      neighborhood,
      city,
      state,
    });

    this.addresses.push(updateAddress);

    return updateAddress;
  }
}

export default FakeAddressesRepository;
