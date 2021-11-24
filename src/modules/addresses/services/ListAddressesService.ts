import { inject, injectable } from 'tsyringe';

import IAddressesRepository from '../repositories/IAddressesRepository';

import Address from '../infra/typeorm/entities/Address';

interface IRequest {
  offset?: number;
  limit?: number;
}

interface IResponse {
  total: number;
  results: Address[];
}

@injectable()
class ListAddressesService {
  constructor(
    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,
  ) {}

  public async execute({
    offset,
    limit,
  }: IRequest): Promise<IResponse> {
    const [
      addresses,
      totalAddresses,
    ] = await this.addressesRepository.findAll(
      offset,
      limit,
    );

    const responseFormatted = {
      total: totalAddresses,
      results: addresses,
    };

    return responseFormatted;

  }
}

export default ListAddressesService;
