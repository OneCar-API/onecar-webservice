import { injectable, inject } from 'tsyringe';

import IMessagesRepository from '../repositories/IMessagesRepository';

import Message from '../infra/typeorm/schemas/Message';

@injectable()
class CreateMessageService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,
  ) {}

  public async execute(chat_id: string): Promise<Message[]> {
    const messages = await this.messagesRepository.findByChat(chat_id);
    
    return messages;
  }
}

export default CreateMessageService;
