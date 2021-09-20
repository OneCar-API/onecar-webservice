import { getRepository, Repository } from 'typeorm';

import IAdsRepository from '@modules/adverts/repositories/IAdsRepository';
import ICreateAdDTO from '@modules/adverts/dtos/ICreateAdDTO';
import Ad from '../../../../adverts/infra/typeorm/entities/Ad';

class AdsRepository implements IAdsRepository {
  private ormRepository: Repository<Ad>;

  constructor() {
    this.ormRepository = getRepository(Ad);
  }

  public async import({
    ad_code,
    vehicle_price,
    user_id
  }: ICreateAdDTO): Promise<Ad> {
    const ad = this.ormRepository.create({
      ad_code,
      price: vehicle_price,
      user_id,
    });

    await this.ormRepository.save(ad);

    return ad;
  }

  public async create({
    ad_code,
    vehicle_price,
    user_id,
    car_id
  }: ICreateAdDTO): Promise<Ad> {
    const ad = this.ormRepository.create({
      ad_code,
      price: vehicle_price,
      user_id,
      car_id
    });

    await this.ormRepository.save(ad);

    return ad;
  }

  public async save(ad: Ad): Promise<Ad> {
    return this.ormRepository.save(ad);
  }

  public async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    const contactQuery = this.ormRepository.createQueryBuilder();

    if (confirm_import) {
      contactQuery.andWhere('confirm_import = :confirm_import', {
        confirm_import: true,
      });
    }

    return confirm_import;
  }

  public async findById(id: string): Promise<Ad | undefined> {
    const ad = this.ormRepository.findOne(id);

    return ad;
  }

  public async findAll(): Promise<Ad[]> {
    const ads = await this.ormRepository.find();

    return ads;
  }
}

export default AdsRepository;