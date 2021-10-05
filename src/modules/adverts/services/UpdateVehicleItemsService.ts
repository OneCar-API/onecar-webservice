import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import VehicleItem from '../../adverts/infra/typeorm/entities/VehicleItem';
import IUpdateVehicleItemsDTO from '../dtos/IUpdateVehicleItemsDTO';


@injectable()
class UpdateVehicleItemsService {
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
    id,
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
  }: IUpdateVehicleItemsDTO): Promise<VehicleItem> {
    if (!ad_id) {
      throw new AppError('AD id required');
    }
    const ad = await this.adsRepository.findById(ad_id);

    if(!ad) {
      throw new AppError('Ad not found');
    }

    const car = await this.carsRepository.findById(ad.car_id.id);

    if(!car) {
      throw new AppError("ID for Car in Ad entity couldn't find any match")
    }

    const items = await this.vehicleItemsRepository.findById(car.vehicle_item_id.id);

    if(!items) {
      throw new AppError("ID for Vehicle Item in Car entity couldn't find any match")
    }

    Object.assign(items.airbag, airbag);
    Object.assign(items.air_conditioning, air_conditioning);
    Object.assign(items.alarm, alarm);
    Object.assign(items.eletric_lock, eletric_lock);
    Object.assign(items.eletric_window, eletric_window);
    Object.assign(items.stereo, stereo);
    Object.assign(items.reverse_sensor, reverse_sensor);
    Object.assign(items.reverse_camera, reverse_camera);
    Object.assign(items.armoured, armoured);
    Object.assign(items.hydraulic_steering, hydraulic_steering);

    await this.vehicleItemsRepository.save(items);

    return items;
  }
}

export default UpdateVehicleItemsService;
