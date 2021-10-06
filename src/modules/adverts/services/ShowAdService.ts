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
class ShowAdService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

  ) {}
  public async execute(id: string): Promise<Ad | undefined> {

    const ad = await this.adsRepository.findById(id);

    if(!ad) {
      throw new AppError('Ad entity were not found');
    }

    const carId = ad.car_id.id;

    const car = await this.carsRepository.findById(carId);

    if(!car) {
      throw new AppError('Car entity were not found');
    }

    const itemsId = car.vehicle_item_id.id;

    const items = await this.vehicleItemsRepository.findById(itemsId);

    if (items) {
      ad.car_id.vehicle_item_id = items;
    }

    return ad;
  }
}

export default ShowAdService;
