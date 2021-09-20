import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAdsService from '@modules/adverts/services/CreateAdsService';
import ListAdsService from '@modules/adverts/services/ListAdsService';

import ListUsersService from '@modules/users/services/ListUsersService';
import { classToClass } from 'class-transformer';

export default class AdsController {
  public async create(request: Request, response: Response): Promise<Response> {

    const createAdDTO = request.body;

    const createAdsService = container.resolve(CreateAdsService);

    const user_id = request.user.id;

    createAdDTO.user_id = user_id

    const createdAd = await createAdsService.execute(createAdDTO);

    return response
      .status(200)
      .json({ message: 'Your file has been imported!',
              ad: createdAd });
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const listAdsService = container.resolve(ListAdsService);

    const ads = await listAdsService.execute();

    return response
      .status(200)
      .json(ads);

  }
}
