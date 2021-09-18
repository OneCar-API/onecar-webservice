import { getRepository, Repository } from 'typeorm';

import ICarsRepository from '@modules/ads/repositories/ICarsRepository';
import ICreateCarDTO from '@modules/ads/dtos/ICreateCarDTO';
import Car from '../entities/Car';

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

  public async save(car: Car): Promise<Car> {
    return this.ormRepository.save(car);
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
    const car = this.ormRepository.findOne(id);

    return car;
  }

  public async findAll(): Promise<Car[]> {
    const cars = await this.ormRepository.find();

    return cars;
  }
}

export default CarsRepository;
