import { getRepository, Repository } from 'typeorm';

import ICarsRepository from '@modules/adverts/repositories/ICarsRepository';
import ICreateCarDTO from '@modules/adverts/dtos/ICreateCarDTO';
import Car from '../../../../adverts/infra/typeorm/entities/Car';
import Ad from '../../../../adverts/infra/typeorm/entities/Ad';
import AppError from '@shared/errors/AppError';

class CarsRepository implements ICarsRepository {
  private ormRepository: Repository<Car>;

  constructor() {
    this.ormRepository = getRepository(Car);
  }

  public async import({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.ormRepository.create({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    });

    await this.ormRepository.save(car);

    return car;
  }

  public async create({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    vehicle_item_id
  }: ICreateCarDTO): Promise<Car> {
    const car = this.ormRepository.create({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    vehicle_item_id,
    });

    await this.ormRepository.save(car);

    return car;
  }

  public async save(car: Car): Promise<Car> {
    await this.ormRepository.save(car);
    const newCar = await this.findById(car.id);
    if (!newCar) {
      throw new AppError('Error during recovering car entity');
    };
    return newCar;
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

  public async findById(id: string): Promise<Car | undefined> {
    const car = await this.ormRepository.findOne({
      relations: ['vehicleItem'],
      where: {
        id
      }
    });
    return car;
  }

  public async findAll(): Promise<Car[]> {
    const cars = await this.ormRepository.find();

    return cars;
  }

  public async findByAd(ad: Ad): Promise<Car> {
    const car = await this.ormRepository.findOneOrFail({
      where: {
        ad_id: ad.id
      }
    })
    return car;
  }
}

export default CarsRepository;
