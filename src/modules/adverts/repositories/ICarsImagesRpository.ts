import CarImage from '../infra/typeorm/entities/CarImage';
import ICreateCarImageDTO from '../dtos/ICreateCarImageDTO';

export default interface ICarsImagesRepository {
  create({
    car_id,
    image,
  }: ICreateCarImageDTO): Promise<CarImage>;
}
