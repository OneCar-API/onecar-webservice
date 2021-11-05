import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn, UpdateDateColumn } from 'typeorm';

@Entity('messages')
class Message {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  text: string;

  @Column('uuid')
  recipient_id: string;

  @Column('uuid')
  advertiser_id: string;

  @Column('uuid')
  chat_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Message;
