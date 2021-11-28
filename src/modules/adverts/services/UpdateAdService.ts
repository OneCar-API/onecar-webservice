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
    doors,
    vehicle_price,
    paused
  }: UpdateAdDTO, userId: string): Promise<Ad> {
    const ad = await this.adsRepository.findById(ad_id);

    if (!ad) {
      throw new AppError('Ad not found');
    }

    if (ad.user_id != userId) {
      throw new AppError('Permission denied');
    }

    const car = await this.carsRepository.findById(ad.car_id);

    if (!car) {
      throw new AppError('Car not found');
    }

    ad.price = vehicle_price ? Number(vehicle_price) : new Number();
    ad.title = title ? title : "";
    ad.description = description ? description : "";
    ad.paused = paused ? paused : false;

    car.manufacturer = manufacturer ? manufacturer : "";
    car.brand = brand ? brand : "";
    car.model = model ? model : "";
    car.year_manufacture = year_manufacture ? year_manufacture : "";
    car.year_model = year_model ? year_model : "";
    car.fuel = fuel ? fuel : "";
    car.gearbox_type = gearbox_type ? gearbox_type : "";
    car.km = km ? km : new Number();
    car.color = color ? color : "";
    car.doors = doors ? doors : new Number();

    await this.carsRepository.save(car);
    const newAd = await this.adsRepository.save(ad);

    newAd.car = car;
    return newAd;
  }
}

export default UpdateAdService;
