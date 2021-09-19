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

  @OneToOne(() => VehicleItem)
  @JoinColumn({ name: 'vehicle_item_id'})
  vehicle_item_id: VehicleItem

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Car;
