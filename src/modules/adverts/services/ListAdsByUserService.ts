import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

@injectable()
class ListAdsByUserService {
  constructor(
    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

  ) {}
  public async execute(user_id: string): Promise<Ad[]> {
    const ads = await this.adsRepository.findAllByUser(user_id)

    return ads;
  }
}

export default ListAdsByUserService;
