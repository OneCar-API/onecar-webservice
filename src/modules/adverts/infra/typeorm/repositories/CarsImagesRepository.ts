import { getRepository, Repository } from 'typeorm';

import ICarsImagesRepository from '@modules/adverts/repositories/ICarsImagesRpository';
import ICreateCarImageDTO from '@modules/adverts/dtos/ICreateCarImageDTO';
import CarImage from '../entities/CarImage';

class CarsImagesRepository
  implements ICarsImagesRepository {
  private ormRepository: Repository<CarImage>;

  constructor() {
    this.ormRepository = getRepository(CarImage);
  }

  public async create({
    car_id,
    image,
  }: ICreateCarImageDTO): Promise<CarImage> {
    const carImage = this.ormRepository.create({
      car_id,
      image,
    });

    await this.ormRepository.save(carImage);

    return carImage;
  }
}

export default CarsImagesRepository;
