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
import Car from './Car';

@Entity('car_attachments')
class CarAttachment {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({nullable: true})
  attachment: string;

  @Column({nullable: true})
  type: string;

  @Column({nullable: true})
  title: string;

  @Column({nullable: true})
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
