import { getMongoRepository, MongoRepository } from 'typeorm';

import IMessagesRepository from '@modules/chat/repositories/IMessagesRepository';
import Message from '../schemas/Message';
import ICreateMessageDTO from '@modules/chat/dtos/ICreateMessageDTO';

class MessagesRepository implements IMessagesRepository {
  private ormRepository: MongoRepository<Message>;

  constructor() {
    this.ormRepository = getMongoRepository(Message, 'mongo');
  }

  public async create({
    text,
    recipient_id,
    advertiser_id,
    chat_id,
  }: ICreateMessageDTO): Promise<Message> {
    const message = this.ormRepository.create({
      text,
      recipient_id,
      advertiser_id,
      chat_id,
    });

    await this.ormRepository.save(message);

    return message;
  }
}

export default MessagesRepository;
