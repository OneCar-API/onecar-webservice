import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from '@modules/addresses/services/CreateAddressService';

export default class AddressesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const {
      zip_code,
      neighborhood,
      city,
      state,
    } = request.body;

    const createAddress = container.resolve(CreateAddressService);

    const address = await createAddress.execute({
      user_id,
      zip_code,
      neighborhood,
      city,
      state,
    });

    return response.json(address);
  }
}
