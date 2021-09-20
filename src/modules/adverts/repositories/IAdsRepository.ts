import ICreateAdDTO from '../dtos/ICreateAdDTO';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

export default interface IAdsRepository {
  import({
    ad_code,
    vehicle_price,
    user_id,
    car_id
  }: ICreateAdDTO): Promise<Ad>;
  create({
    ad_code,
    vehicle_price,
    user_id,
    car_id
  }: ICreateAdDTO): Promise<Ad>;
  findById(id: string): Promise<Ad | undefined>;
  findAll(): Promise<Ad[]>;
}
