import ICreateCarDTO from '../dtos/ICreateCarDTO';
import Car from '../../adverts/infra/typeorm/entities/Car';

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
  agreeToSubscribeData(confirm_import: boolean): Promise<boolean>;
  findById(id: string): Promise<Car | undefined>;
  findAll(): Promise<Car[]>;

}
