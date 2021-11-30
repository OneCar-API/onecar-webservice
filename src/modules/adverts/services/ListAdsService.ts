import { injectable, inject } from 'tsyringe';

import IAdsRepository from '../repositories/IAdsRepository';
import Ad from '../../adverts/infra/typeorm/entities/Ad';

interface IRequest {
  offset?: number;
  limit?: number;
  filters?: {
    user?: string;
    car?: string;
    address?: string;
    airbag?: boolean;
    alarm?: boolean;
    paused?: boolean;
    air_conditioning?: boolean;
    eletric_lock?: boolean;
    eletric_window?: boolean;
    stereo?: boolean;
    reverse_sensor?: boolean;
    reverse_camera?: boolean;
    armoured?: boolean;
    hydraulic_steering?: boolean;
    fromKm?: number;
    toKm?: number;
  };
}

interface IResponse {
  total: number;
  results: Ad[];
}

@injectable()
class ListAdsService {
  constructor(
    @inject('AdsRepository')
    private adsRepository: IAdsRepository,
  ) {}
  public async execute({
    filters,
    offset,
    limit,
  }: IRequest): Promise<IResponse> {
    const [
      ads,
      totalAds,
      previous,
      next,
    ] = await this.adsRepository.findAll(
      offset,
      limit,
      filters,
    );

    var unpausedAds = ads.filter(ad => !ad.paused);

    console.log(ads);

    const responseFormatted = {
      total: totalAds,
      previous,
      next,
      results: unpausedAds,
    };

    return responseFormatted;
  }
}

export default ListAdsService;
