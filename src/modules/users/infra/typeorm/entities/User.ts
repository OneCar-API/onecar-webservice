import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import Address from '../../../../addresses/infra/typeorm/entities/Address';
import Ad from '../../../../adverts/infra/typeorm/entities/Ad';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column()
  document: string;

  @Column()
  cnpj: string;

  @Column()
  is_legal: boolean;

  @Column()
  is_active: boolean;

  confirm_import: boolean;

  @OneToOne(() => Address, address => address.user)
  address: Address;

  @OneToMany(() => Ad, ads => ads.user)
  ads: Ad[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
