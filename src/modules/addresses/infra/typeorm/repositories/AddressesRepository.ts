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
}

export default AddressesRepository;
