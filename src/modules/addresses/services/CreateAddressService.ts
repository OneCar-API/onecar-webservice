import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAddressesRepository from '../repositories/IAddressesRepository';

import Address from '../infra/typeorm/entities/Address';

interface IRequest {
  user_id: string;
  zip_code: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}


@injectable()
class CreateAddressService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({
    user_id,
    zip_code,
    neighborhood,
    city,
    state,
    }: IRequest): Promise<Address> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    if (zip_code) {
      const isNumber = zip_code.match(/^\d+$/) !== null;

      if (!isNumber) {
        throw new AppError('Zip code formatting is wrong.', 401);
      }
    }

    const address = await this.addressesRepository.create({
      user_id: user.id,
      zip_code,
      neighborhood,
      city,
      state,
    });

    return address;
  }
}

export default CreateAddressService;
