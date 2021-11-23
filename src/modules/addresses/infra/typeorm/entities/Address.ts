import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { EncryptionTransformer } from 'typeorm-encrypted';

import User from '../../../../users/infra/typeorm/entities/User';

@Entity('addresses')
class Address {
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
  zip_code: string;

   @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  neighborhood: string;

   @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  city: string;

   @Column({
    transformer: new EncryptionTransformer({
      key: `${process.env.AES_KEY}`,
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: `${process.env.AES_IV}`
    })
  })
  state: string;

  @OneToOne(() => User, user => user.address)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Address;
