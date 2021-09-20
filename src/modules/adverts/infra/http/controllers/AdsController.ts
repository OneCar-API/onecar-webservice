import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAdsService from '@modules/adverts/services/CreateAdsService';
import ListAdsService from '@modules/adverts/services/ListAdsService';
import ShowAdService from '@modules/adverts/services/ShowAdService';
import ImportAdsService from '@modules/adverts/services/ImportAdsService';

import ListUsersService from '@modules/users/services/ListUsersService';
import { classToClass } from 'class-transformer';
import AppError from '@shared/errors/AppError';

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

  public async index(request: Request, response: Response): Promise<Response> {
    const listAdsService = container.resolve(ListAdsService);

    const id = request.params.id;

    if (!id) {
      throw new AppError("Id inválido")
    }

    const showAdService = container.resolve(ShowAdService);

    const ad = await showAdService.execute(id);
    return response
      .status(200)
      .json(ad);

  }

  public async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const importAdsService = container.resolve(ImportAdsService);

    const user_id = request.user.id;

    const adsFailed = await importAdsService.execute(
      file as Express.Multer.File,
      user_id,
    );

    return response
      .status(200)
      .json({ message: 'Your file has been imported!', adsFailed });
  }
}
