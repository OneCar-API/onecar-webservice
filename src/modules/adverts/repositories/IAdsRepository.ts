import ICreateAdDTO from '../dtos/ICreateAdDTO';
import IImportAdsDTO from '../dtos/IImportAdsDTO';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

export default interface IAdsRepository {
  import({
    ad_code,
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    document,
    cnpj,
    price
  }: IImportAdsDTO): Promise<Ad>;
  create({
    ad_code,
    vehicle_price,
    user_id,
    car_id
  }: ICreateAdDTO): Promise<Ad>;
  findById(id: string): Promise<Ad | undefined>;
  findAll(): Promise<Ad[]>;
}
