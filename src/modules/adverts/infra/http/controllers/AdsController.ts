import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateAdsService from '@modules/adverts/services/CreateAdsService';
import ListAdsService from '@modules/adverts/services/ListAdsService';
import ShowAdService from '@modules/adverts/services/ShowAdService';
import ImportAdsService from '@modules/adverts/services/ImportAdsService';
import UpdateAdService from '@modules/adverts/services/UpdateAdService';
import UpdateVehicleItemsService from '@modules/adverts/services/UpdateVehicleItemsService';

import AppError from '@shared/errors/AppError';
import UploadCarImagesService from '@modules/adverts/services/UploadCarImagesService';

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
      .json(classToClass(ads));
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
      .json(classToClass(ad));

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

  public async updateAd(request: Request, response: Response): Promise<Response> {
    const updateService = container.resolve(UpdateAdService);

    const requestBody = request.body;

    requestBody.ad_id = request.params.id;

    const updatedAd = await updateService.execute(requestBody);

    return response
      .status(200)
      .json(classToClass(updatedAd));
  }

  public async updateVehicleItems(request: Request, response: Response): Promise<Response> {
    const updateItemsService = container.resolve(UpdateVehicleItemsService);

    const requestBody = request.body;

    requestBody.ad_id = request.params.id;

    const updatedAd = await updateItemsService.execute(requestBody);

    return response
      .status(200)
      .json(updatedAd);
  }

  public async upload(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { car_id } = request.params;

    const imageCarFilename = request.file?.filename;

    const uploadCarImage = container.resolve(
      UploadCarImagesService,
    );

    const carAttachmentFilename = await uploadCarImage.execute(
      {
        user_id,
        car_id,
        imageCarFilename: imageCarFilename as string,
      },
    );

    return response.json(classToClass(carAttachmentFilename));
  }
}
