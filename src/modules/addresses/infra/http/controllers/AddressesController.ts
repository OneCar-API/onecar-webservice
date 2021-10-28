import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAddressService from '@modules/addresses/services/CreateAddressService';
import ListAddressesService from '@modules/addresses/services/ListAddressesService';
import ShowAddressService from '@modules/addresses/services/ShowAddressService';

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

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      offset,
      limit,
    } = request.query;

    const listAddress = container.resolve(ListAddressesService);

    const addresses = await listAddress.execute({
      offset: Number(offset),
      limit: Number(limit),
    });

    return response.json(addresses);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { address_id } = request.params;

    const showAddress = container.resolve(ShowAddressService);

    const addresses = await showAddress.execute(user_id, address_id);

    return response.json(addresses);
  }
}
