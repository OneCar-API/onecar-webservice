import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IAddressesRepository from '../repositories/IAddressesRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  address_id: string;
}

@injectable()
class DeleteAddressService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    address_id,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const address = await this.addressesRepository.findById(address_id);

    if (!address) {
      throw new AppError('Address not found.', 404);
    }

    await this.addressesRepository.deleteById(address.id);
  }
}

export default DeleteAddressService;
