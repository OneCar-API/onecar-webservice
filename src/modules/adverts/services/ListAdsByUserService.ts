import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';
import User from '@modules/users/infra/typeorm/entities/User';

@injectable()
class ListAdsByUserService {
  constructor(
    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

  ) {}
  public async execute(user_id: string): Promise<Ad[]> {
    const ads = await this.adsRepository.findAllByUser(user_id)

    ads.forEach(ad => {
      ad.user = new User();
    });

    return ads;
  }
}

export default ListAdsByUserService;
