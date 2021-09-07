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
import Car from '@modules/ads/infra/typeorm/entities/Car';

@Entity('car_attachments')
class CarAttachment {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  attachment: string;

  @Column()
  type: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToOne(() => Car)
  @JoinColumn({ name: 'car_id'})
  car_id: Car;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CarAttachment;
