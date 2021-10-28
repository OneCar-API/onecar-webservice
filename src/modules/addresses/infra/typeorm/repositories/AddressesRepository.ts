import { getRepository, Repository } from 'typeorm';

import IAddressesRepository from '@modules/addresses/repositories/IAddressesRepository';
import ICreateAddressDTO from '@modules/addresses/dtos/ICreateAddressDTO';
import Address from '../entities/Address';
import IUpdateAddressDTO from '@modules/addresses/dtos/IUpdateAddressDTO';

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

  public async findAll(
    offset?: number,
    limit?: number,
  ): Promise<[Address[], number]> {
    const addressesQuery = this.ormRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.user', 'user')
      .select([
        'user.id',
        'user.name',
        'address.id',
        'address.city',
        'address.state',
        'address.created_at',
      ])
      .skip(offset || (offset = 0))
      .take(limit || (limit = 20))
      .orderBy('address.created_at', 'DESC');


    const [addresses, totalAddresses] = await addressesQuery.getManyAndCount();

    return [addresses, totalAddresses];
  }

  public async findById(
    id: string
  ): Promise<Address | undefined> {
    const address = await this.ormRepository.findOne({
      id,
    });

    return address;
  }

  public async update({
    address_id,
    zip_code,
    neighborhood,
    city,
    state,
  }: IUpdateAddressDTO): Promise<Address> {
    const findAddress = await this.ormRepository.findOne({ id: address_id });

    const updateAddress = Object.assign(findAddress, {
      zip_code,
      neighborhood,
      city,
      state,
    });

    await this.ormRepository.save(updateAddress);

    return updateAddress;
  }
}

export default AddressesRepository;
