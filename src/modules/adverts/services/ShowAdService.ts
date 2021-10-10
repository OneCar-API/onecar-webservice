import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

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
  public async execute(ad_id: string): Promise<Ad | undefined> {
    const ad = await this.adsRepository.showAd(ad_id);

    if(!ad) {
      throw new AppError('Ad entity were not found', 404);
    }

    const carId = ad.car.id;

    const car = await this.carsRepository.findById(carId);

    if(!car) {
      throw new AppError('Car entity were not found', 404);
    }

    const itemsId = car.vehicle_item_id;

    const items = await this.vehicleItemsRepository.findById(itemsId);

    if (items) {
      ad.car.vehicleItem = items;
    }

    return ad;
  }
}

export default ShowAdService;
