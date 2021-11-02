import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import { request } from 'express';
import Ad from '../../adverts/infra/typeorm/entities/Ad';
import VehicleItem from '../../adverts/infra/typeorm/entities/VehicleItem';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateIndividualAdDTO from '../dtos/ICreateIndividualAdDTO';
import IUsersRepository from '../../users/repositories/IUsersRepository'
import { th } from 'date-fns/locale';


@injectable()
class CreateImportedAdService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

  ) {}
  public async execute({
    ad_code,
    user_id,
    title,
    description,
    vehicle_price,
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    fuel,
    gearbox_type,
    km,
    color,
    doors
  }: ICreateIndividualAdDTO): Promise<Ad> {

    if(!user_id) {
      throw new AppError('This request did not receive a user id');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User were not found');
    }

    const vehicleItemsEntity = await this.vehicleItemsRepository.create({});

    const car = await this.carsRepository.create({
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
      vehicle_item_id: vehicleItemsEntity.id,
    });


    const ad = await this.adsRepository.create({
      ad_code,
      title,
      description,
      vehicle_price,
      user_id: user,
      car_id: car.id,
    });

    car.vehicleItem = vehicleItemsEntity;
    ad.car = car;

    return ad;
  }
}

export default CreateImportedAdService;
