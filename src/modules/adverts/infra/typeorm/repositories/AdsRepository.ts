import { Brackets, getConnection, getRepository, Repository } from 'typeorm';

import IAdsRepository from '@modules/adverts/repositories/IAdsRepository';
import ICreateAdDTO from '@modules/adverts/dtos/ICreateAdDTO';
import Ad from '../../../../adverts/infra/typeorm/entities/Ad';
import IImportAdsDTO from '@modules/adverts/dtos/IImportAdsDTO';
import AppError from '@shared/errors/AppError';

class AdsRepository implements IAdsRepository {
  private ormRepository: Repository<Ad>;

  constructor() {
    this.ormRepository = getRepository(Ad);
  }

  public async import({
    ad_code,
    manufacturer,
    brand,
    model,
    year_manufacture,
    year_model,
    document,
    cnpj,
    price,
    user_id
  }: IImportAdsDTO): Promise<Ad> {
    const ad = this.ormRepository.create({
      ad_code,
      price,
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
      car_id,
    });

    await this.ormRepository.save(ad);

    return ad;
  }

  public async save(ad: Ad): Promise<Ad> {
    await this.ormRepository.save(ad);
    const newAd = await this.findById(ad.id);
    if (!newAd) {
      throw new AppError('Error during recovering Ad entity');
    };
    return newAd;
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
    const ad = await this.ormRepository.findOne(id);

    return ad;
  }

  public async findAll(
    offset?: number,
    limit?: number,
    filters?: {
      user?: string;
      car?: string;
      address?: string;
      fromKm?: number;
      toKm?: number;
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
  ): Promise<[Ad[], number, boolean, boolean]> {
    const adsQuery = this.ormRepository
      .createQueryBuilder('ad')
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('ad.car', 'car')
      .leftJoinAndSelect('car.vehicleItem', 'vehicleItem')
      .leftJoinAndSelect('car.carImages', 'carImages')
      .select([
        'ad.id',
        'ad.price',
        'ad.created_at',
        'car.id',
        'car.manufacturer',
        'car.brand',
        'car.model',
        'car.year_manufacture',
        'car.year_model',
        'car.fuel',
        'car.gearbox_type',
        'car.color',
        'car.km',
        'carImages.id',
        'carImages.image',
        'carImages.car_id',
        'address.id',
        'address.city',
        'address.state',
      ])
      .skip(offset || (offset = 0))
      .take(limit || (limit = 20))
      .orderBy('ad.created_at', 'DESC');

    if (filters?.user) {
      adsQuery.andWhere(
        new Brackets(qb => {
          qb.where('user.name like :name', {
            name: `%${filters.user}%`,
          })
            .orWhere('user.phone like :phone', {
              phone: `%${filters.user}%`,
            })
        }),
      );
    }

    if (filters?.address) {
      adsQuery.andWhere(
        new Brackets(qb => {
          qb.where('address.city like :city', {
            city: `%${filters.address}%`,
          })
            .orWhere('address.state like :state', {
              state: `%${filters.address}%`,
            });
        }),
      );
    }

    if (filters?.car) {
      adsQuery.andWhere(
        new Brackets(qb => {
          qb.where('car.manufacturer like :manufacturer', {
            manufacturer: `%${filters.car}%`,
          })
            .orWhere('car.brand like :brand', {
              brand: `%${filters.car}%`,
            })
            .orWhere('car.model like :model', {
              model: `%${filters.car}%`,
            })
            .orWhere('car.year_manufacture like :year_manufacture', {
              year_manufacture: `%${filters.car}%`,
            })
            .orWhere('car.year_model like :year_model', {
              year_model: `%${filters.car}%`,
            })
            .orWhere('car.fuel like :fuel', {
              fuel: `%${filters.car}%`,
            })
            .orWhere('car.gearbox_type like :gearbox_type', {
              gearbox_type: `%${filters.car}%`,
            })
            .orWhere('car.color like :color', {
              color: `%${filters.car}%`,
            })
        }),
      );
    }

    if (filters?.fromKm && !filters?.toKm) {
      adsQuery.andWhere(
        'car.km >= :fromKm',
        {
          fromKm: filters.fromKm,
        },
      );
    }

    if (filters?.fromKm && filters?.toKm) {
      adsQuery.andWhere(
        'car.km >= :fromKm and car.km <= :toKm',
        {
          fromKm: filters.fromKm,
          toKm: filters.toKm,
        },
      );
    }

    if (filters?.air_conditioning) {
      adsQuery.andWhere('vehicleItem.air_conditioning', {
        air_conditioning: false,
      });
    }

    if (filters?.airbag) {
      adsQuery.andWhere('vehicleItem.airbag', {
        airbag: false,
      });
    }

    if (filters?.alarm) {
      adsQuery.andWhere('vehicleItem.alarm', {
        alarm: false,
      });
    }

    if (filters?.armoured) {
      adsQuery.andWhere('vehicleItem.armoured', {
        armoured: false,
      });
    }

    if (filters?.eletric_lock) {
      adsQuery.andWhere('vehicleItem.eletric_lock', {
        eletric_lock: false,
      });
    }

    if (filters?.eletric_window) {
      adsQuery.andWhere('vehicleItem.eletric_window', {
        eletric_window: false,
      });
    }

    if (filters?.hydraulic_steering) {
      adsQuery.andWhere('vehicleItem.hydraulic_steering', {
        hydraulic_steering: false,
      });
    }

    if (filters?.reverse_camera) {
      adsQuery.andWhere('vehicleItem.reverse_camera', {
        reverse_camera: false,
      });
    }

    if (filters?.reverse_sensor) {
      adsQuery.andWhere('vehicleItem.reverse_sensor', {
        reverse_sensor: false,
      });
    }

    if (filters?.stereo) {
      adsQuery.andWhere('vehicleItem.stereo', {
        stereo: false,
      });
    }

    const [ads, totalAds] = await adsQuery.getManyAndCount();

    let previous = true;

    let next = true;

    if (offset === 0) {
      previous = false;
    }

    if (limit) {
      if (offset === 0 || (offset && offset !== 0)) {
        const existNextPage = limit + offset;

        if (existNextPage >= totalAds) {
          next = false;
        }
      }
    }

    return [ads, totalAds, previous, next];
  }

  public async showAd(
    ad_id: string,
  ): Promise<Ad | undefined> {
    const ad = await this.ormRepository
      .createQueryBuilder('ad')
      .where('ad.id = :ad_id', { ad_id })
      .leftJoinAndSelect('ad.user', 'user')
      .leftJoinAndSelect('user.address', 'address')
      .leftJoinAndSelect('ad.car', 'car')
      .leftJoinAndSelect('car.vehicleItem', 'vehicleItem')
      .leftJoinAndSelect('car.carImages', 'carImages')
      .select([
        'ad.id',
        'ad.description',
        'ad.price',
        'ad.interests',
        'ad.views',
        'ad.created_at',
        'car.id',
        'car.manufacturer',
        'car.brand',
        'car.model',
        'car.year_manufacture',
        'car.year_model',
        'car.fuel',
        'car.gearbox_type',
        'car.color',
        'car.km',
        'vehicleItem.id',
        'vehicleItem.airbag',
        'vehicleItem.alarm',
        'vehicleItem.air_conditioning',
        'vehicleItem.eletric_lock',
        'vehicleItem.eletric_window',
        'vehicleItem.stereo',
        'vehicleItem.reverse_sensor',
        'vehicleItem.reverse_camera',
        'vehicleItem.armoured',
        'vehicleItem.hydraulic_steering',
        'carImages.id',
        'carImages.image',
        'carImages.car_id',
        'user.id',
        'user.name',
        'user.phone',
        'address.id',
        'address.city',
        'address.state',
      ])
      .getOne();

    return ad;
  }

  public async delete(id: string): Promise<String> {
    await this.ormRepository.delete(id);
    return "Ad deleted";
  }

  public async findAllByUser(user_id: string): Promise<Ad[]> {
    const ads = await this.ormRepository.
    find(
      {
        relations: ['car', 'user', 'car.carImages'],
        where: { user_id }
      },
    );
    return ads;
  }
}

export default AdsRepository;
