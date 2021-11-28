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

@injectable()
class DeleteAdService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,
  ) {}
  public async execute(id: string, user_id: string): Promise<String> {

    const ad = await this.adsRepository.findById(id);

    if (!ad) {
      throw new AppError('Ad entity were not found');
    }

    if (ad.paused) {
      throw new AppError('Ad not found', 404);
    }

    if (ad.user_id != user_id) {
      throw new AppError('Permission Denied. Only the Ad owner is allowed to delete an Ad');
    }

    await this.adsRepository.delete(ad.id);


    return "Ad deleted";
  }
}

export default DeleteAdService;
