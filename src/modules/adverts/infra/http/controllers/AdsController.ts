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
      .json(createdAd);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { ad_id } = request.params;

    const showAd = container.resolve(ShowAdService);

    const ad = await showAd.execute(ad_id);

    return response
      .status(200)
      .json(classToClass(ad));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const {
      user,
      car,
      address,
      airbag,
      alarm,
      air_conditioning,
      eletric_lock,
      eletric_window,
      stereo,
      reverse_sensor,
      reverse_camera,
      armoured,
      hydraulic_steering,
      fromKm,
      toKm,
      offset,
      limit,
    } = request.query;

    const listAds = container.resolve(ListAdsService);

    const ads = await listAds.execute({
      filters: {
        user: user as string,
        car: car as string,
        address: address as string,
        airbag: Boolean(airbag),
        alarm: Boolean(alarm),
        air_conditioning: Boolean(air_conditioning),
        eletric_lock: Boolean(eletric_lock),
        eletric_window: Boolean(eletric_window),
        stereo: Boolean(stereo),
        reverse_sensor: Boolean(reverse_sensor),
        reverse_camera: Boolean(reverse_camera),
        armoured: Boolean(armoured),
        hydraulic_steering: Boolean(hydraulic_steering),
        fromKm: Number(fromKm),
        toKm: Number(hydraulic_steering),
      },
      offset: Number(offset),
      limit: Number(limit),
    });

    return response.json(classToClass(ads));
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
