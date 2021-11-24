import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';
import { Exclude } from 'class-transformer';

import 'dotenv/config';

import Address from '../../../../addresses/infra/typeorm/entities/Address';
import Ad from '../../../../adverts/infra/typeorm/entities/Ad';


@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  name: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  nickname: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  phone: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  document: string;

  @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
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
