import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAddressesRepository from '../repositories/IAddressesRepository';

import Address from '../infra/typeorm/entities/Address';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

@injectable()
class ShowAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(user_id: string, address_id: string): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const address = await this.addressesRepository.findById(address_id);

    if (!address) {
      throw new AppError('Address not found', 404);
    }

    return address;
  }
}

export default ShowAddressService;
