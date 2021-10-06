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

    console.log(car);
    const items = await this.vehicleItemsRepository.findById(car.vehicle_item_id.id);

    if(!items) {
      throw new AppError("ID for Vehicle Item in Car entity couldn't find any match")
    }

    items.airbag = airbag != undefined ? airbag : false;
    items.air_conditioning = air_conditioning != undefined ? air_conditioning : false;
    items.alarm = alarm != undefined ? alarm : false;
    items.eletric_lock = eletric_lock != undefined ? eletric_lock : false;
    items.eletric_window = eletric_window != undefined ? eletric_window : false;
    items.stereo = stereo != undefined ? stereo : false;
    items.reverse_sensor = reverse_sensor != undefined ? reverse_sensor : false;
    items.reverse_camera = reverse_camera != undefined ? reverse_camera : false;
    items.armoured = armoured != undefined ? armoured : false;
    items.hydraulic_steering = hydraulic_steering != undefined ? hydraulic_steering : false;

    await this.vehicleItemsRepository.save(items);

    return items;
  }
}

export default UpdateVehicleItemsService;
