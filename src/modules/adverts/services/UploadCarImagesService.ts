import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import ICarsImagesRepository from '@modules/adverts/repositories/ICarsImagesRpository';

import CarImage from '@modules/adverts/infra/typeorm/entities/CarImage';
import ICarsRepository from '@modules/adverts/repositories/ICarsRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  car_id: string;
  imageCarFilename: string;
}

@injectable()
class UploadCarImagesService {
  constructor(

    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    car_id,
    imageCarFilename,
  }: IRequest): Promise<CarImage> {
    const user = await this.usersRepository.findById(
      user_id,
    );

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    const car = await this.carsRepository.findById(
      car_id,
    );

    if (!car) {
      throw new AppError('Car not found.', 404);
    }

    const filename = await this.storageProvider.saveFile(
      imageCarFilename,
      'image',
    );

    const createCarImage = await this.carsImagesRepository.create(
      {
        car_id: car.id,
        image: filename,
      },
    );

    return createCarImage;
  }
}

export default UploadCarImagesService;
