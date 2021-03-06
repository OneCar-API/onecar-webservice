import ICreateCarDTO from '../dtos/ICreateCarDTO';
import Car from '../../adverts/infra/typeorm/entities/Car';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

export default interface ICarsRepository {
  import({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
  }: ICreateCarDTO): Promise<Car>;
  create({
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
  }: ICreateCarDTO): Promise<Car>;
  save(car: Car): Promise<Car>;
  findById(id: string): Promise<Car | undefined>;
  findAll(): Promise<Car[]>;
  findByAd(ad: Ad): Promise<Car | undefined>;
  delete(id: string): Promise<String>
}
