import { v4 as uuidV4 } from 'uuid';

import ICreateCarImageDTO from '@modules/cars/dtos/ICreateCarImageDTO';
import ICarsImagesRepository from '../ICarsImagesRepository';

import CarImage from '../../infra/typeorm/entities/CarImage';

class FakeCarsImagesRepository
  implements ICarsImagesRepository {
  private carsImages: CarImage[] = [];

  public async create({
    car_id,
    image,
  }: ICreateCarImageDTO): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, {
      id: uuidV4(),
      car_id,
      image,
    });

    this.carsImages.push(carImage);

    return carImage;
  }
}

export default FakeCarsImagesRepository;
