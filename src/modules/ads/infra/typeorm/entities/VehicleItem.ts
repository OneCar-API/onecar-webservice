import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';

@Entity('vehicle_items')
class VehicleItem {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  airbag: boolean;

  @Column()
  alarm: boolean;

  @Column()
  air_conditioning: boolean;

  @Column()
  eletric_lock: boolean;

  @Column()
  eletric_window: boolean;

  @Column()
  stereo: boolean;

  @Column()
  reverse_sensor: boolean;

  @Column()
  reverse_camera: boolean;

  @Column()
  armoured: boolean;

  @Column()
  hydraulic_steering: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleItem;
