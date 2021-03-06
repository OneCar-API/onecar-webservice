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
  id: string;

  @Column()
  ad_code: string;

  @Column()
  title: string;

  @Column({nullable: true})
  description: string;

  @Column()
  price: Number;

  @Column({nullable: true})
  views: number;

  @Column({nullable: true})
  interests: number;

  @ManyToOne(() => User, user => user.ads)
  @JoinColumn({ name: 'user_id'})
  user: User

  @Column()
  user_id: string;

  @OneToOne(() => Car, car => car.ad)
  @JoinColumn({ name: 'car_id'})
  car: Car;

  @Column()
  car_id: string;

  @Column({nullable: true})
  paused: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Ad;
