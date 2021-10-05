import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';
import UpdateAdDTO from '../dtos/IUpdateAdDTO';


@injectable()
class UpdateAdService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

  ) {}
  public async execute({
    ad_id,
    title,
    description,
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    fuel,
    gearbox_type,
    km,
    color,
    vehicle_price,
  }: UpdateAdDTO): Promise<Ad> {
    const ad = await this.adsRepository.findById(ad_id);

    console.log(ad);

    if (!ad) {
      throw new AppError('Ad not found');
    }

    const car = await this.carsRepository.findById(ad.car_id.id);

    if (!car) {
      throw new AppError('Car not found');
    }

    Object.assign(ad.price, vehicle_price);
    Object.assign(ad.title, title);
    Object.assign(ad.description, description);

    const updatedAd = await this.adsRepository.save(ad);

    Object.assign(car.manufacturer, manufacturer);
    Object.assign(car.brand, brand);
    Object.assign(car.model, model);
    Object.assign(car.year_manufacture, year_manufacture);
    Object.assign(car.year_model, year_model);
    Object.assign(car.fuel, fuel);
    Object.assign(car.gearbox_type, gearbox_type);
    Object.assign(car.km, km);
    Object.assign(car.color, color);

    await this.carsRepository.save(car);

    return updatedAd;
  }
}

export default UpdateAdService;
