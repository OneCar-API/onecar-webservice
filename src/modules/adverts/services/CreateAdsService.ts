import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

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
  user_id: string;
}

@injectable()
class CreateAdsService {
  constructor(
    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

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
    vehicle_price,
    user_id
  }: IRequest): Promise<Ad> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

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
      user_id: user.id,
      car_id: car.id,
    });

    return ad;
  }
}

export default CreateAdsService;
