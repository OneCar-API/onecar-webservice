import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import VehicleItem from './VehicleItem';

@Entity('cars')
class Car {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  manufacturer: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year_manufacture: string;

  @Column()
  fuel: string;

  @Column()
  gearbox_type: string;

  @Column()
  km: Number;

  @Column()
  color: string;

  @OneToOne(() => VehicleItem)
  @JoinColumn({ name: 'vehicle_item_id'})
  vehicle_item_id: VehicleItem

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Car;
