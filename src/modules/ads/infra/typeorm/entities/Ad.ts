import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import User from '../../../../users/infra/typeorm/entities/User';
import Car from './Car';


@Entity('ads')
class Ad {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column()
  ad_code: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: Number;

  @Column()
  views: Number;

  @Column()
  interests: Number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id'})
  user_id: User

  @OneToOne(() => Car)
  @JoinColumn({ name: 'car_id'})
  car_id: Car;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Ad;
