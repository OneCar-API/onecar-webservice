import { v4 as uuidV4 } from 'uuid';

import ICreateCarDTO from '@modules/adverts/dtos/ICreateCarDTO';
import ICarsRepository from '../ICarsRepository';

import Car from '../../infra/typeorm/entities/Car';
import Ad from '@modules/adverts/infra/typeorm/entities/Ad';

class FakeCarsRepository
  implements ICarsRepository {
  private cars: Car[] = [];

  public async import({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      id: uuidV4(),
      manufacturer,
      brand,
      model,
      year_manufacture,
      year_model,
    });

    this.cars.push(car);

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
    const car = new Car();

    Object.assign(car, {
      id: uuidV4(),
      manufacturer,
      brand,
      model,
      year_manufacture,
      year_model,
      vehicle_item_id,
    });

    this.cars.push(car);

    return car;
  }

  public async save(car: Car): Promise<Car> {
    const findIndex = this.cars.findIndex(findCar => findCar.id === car.id);

    this.cars[findIndex] = car;

    return car;
  }

  public async findById(id: string): Promise<Car | undefined> {
    const findCar = this.cars.find(car => car.id === id);

    return findCar;
  }

  public async findAll(): Promise<Car[]> {
    const findCars = this.cars.filter(car => car);

    return findCars;
  }

  public async findByAd(ad: Ad): Promise<Car | undefined> {
    const car = this.cars.find(car => car.ad === ad);

    return car;
  }
}

export default FakeCarsRepository;
