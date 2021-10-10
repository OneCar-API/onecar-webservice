import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import { request } from 'express';
import Ad from '../../adverts/infra/typeorm/entities/Ad';
import VehicleItem from '../../adverts/infra/typeorm/entities/VehicleItem';
import User from '@modules/users/infra/typeorm/entities/User';

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
  user_id: User;
}

@injectable()
class CreateImportedAdService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

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
    user_id
  }: IRequest): Promise<Ad> {

    const vehicleItemsEntity = await this.vehicleItemsRepository.create({});

    const car = await this.carsRepository.create({
      manufacturer,
      brand,
      model,
      year_manufacture,
      year_model,
      vehicle_item_id: vehicleItemsEntity.id,
    });


    const ad = await this.adsRepository.create({
      ad_code,
      vehicle_price,
      user_id,
      car_id: car.id,
    });

    return ad
  }
}

export default CreateImportedAdService;
