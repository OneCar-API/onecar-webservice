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
  save(ad: Ad): Promise<Ad>;
  findAll(
    offset?: number,
    limit?: number,
    filters?: {
      user?: string;
      car?: string;
      address?: string;
      airbag?: boolean;
      alarm?: boolean;
      air_conditioning?: boolean;
      eletric_lock?: boolean;
      eletric_window?: boolean;
      stereo?: boolean;
      reverse_sensor?: boolean;
      reverse_camera?: boolean;
      armoured?: boolean;
      hydraulic_steering?: boolean;
    },
  ): Promise<[Ad[], number, boolean, boolean]>;
  showAd(
    ad_id: string,
  ): Promise<Ad | undefined>;
}
