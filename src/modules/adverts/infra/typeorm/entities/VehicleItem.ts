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

  @Column({type: 'boolean', nullable: true})
  airbag: boolean;

  @Column({type: 'boolean', nullable: true})
  alarm: boolean;

  @Column({nullable: true})
  air_conditioning: boolean;

  @Column({nullable: true})
  eletric_lock: boolean;

  @Column({nullable: true})
  eletric_window: boolean;

  @Column({nullable: true})
  stereo: boolean;

  @Column({nullable: true})
  reverse_sensor: boolean;

  @Column({nullable: true})
  reverse_camera: boolean;

  @Column({nullable: true})
  armoured: boolean;

  @Column({nullable: true})
  hydraulic_steering: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default VehicleItem;
