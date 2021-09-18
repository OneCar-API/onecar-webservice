import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import { request } from 'express';
import Ad from '../infra/typeorm/entities/Ad';


interface IRequest {
  ad_code?: string;
  manufacturer?: string;
  brand?: string;
  model?: string;
  year_manufacture?: string;
  year_model?: string;
  document?: string;
  cnpj?: string;
  vehicle_price?: string;
}

@injectable()
class CreateAdsService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    ad_code,
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    document,
    cnpj,
    vehicle_price,
  }: IRequest): Promise<Ad> {
    const vehicleItems = await this.vehicleItemsRepository.create({});
    const vehicleItemsEntity = await this.vehicleItemsRepository.import(vehicleItems);

    const vehicleId = vehicleItemsEntity.id

    const carDTO = await this.carsRepository.create({
      manufacturer,
      brand,
      model,
      year_manufacture,
      year_model,
      vehicle_item_id: vehicleId
    });

    const car = await this.carsRepository.import(carDTO)

    const carId = car.id

    const ad = await this.adsRepository.create({
      ad_code,
      vehicle_price,
      user_id: request.user.id,
      car_id: carId,
    });

    return ad;
  }
}

export default CreateAdsService;
