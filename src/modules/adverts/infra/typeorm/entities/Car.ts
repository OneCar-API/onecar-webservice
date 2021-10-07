import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import VehicleItem from './VehicleItem';
import CarImage from './CarImage';
import Ad from '../../../infra/typeorm/entities/Ad';

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({nullable: true})
  manufacturer: string;

  @Column({nullable: true})
  brand: string;

  @Column({nullable: true})
  model: string;

  @Column({nullable: true})
  year_manufacture: string;

  @Column({nullable: true})
  year_model: string;

  @Column({nullable: true})
  fuel: string;

  @Column({nullable: true})
  gearbox_type: string;

  @Column({nullable: true})
  km: Number;

  @Column({nullable: true})
  color: string;

  @OneToOne(() => VehicleItem, vehicleItem => vehicleItem.car)
  @JoinColumn({ name: 'vehicle_item_id'})
  vehicleItem: VehicleItem;

  @Column()
  vehicle_item_id: string;

  @OneToMany(() => CarImage, carImages => carImages.car)
  carImages: CarImage[];

  @OneToOne(() => Ad, ad => ad.car)
  ad: Ad;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Car;
