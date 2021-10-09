import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

import uploadConfig from '../../../../../config/upload';
import Car from './Car';

@Entity('cars_images')
class CarImage {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({nullable: true})
  image: string;

  @ManyToOne(() => Car, car => car.carImages)
  @JoinColumn({ name: 'car_id'})
  car: Car;

  @Column()
  car_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'image_url' })
  getAttachmentUrl(): string | null {
    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/image/${this.image}`;
      default:
        return null;
    }
  }
}

export default CarImage;
