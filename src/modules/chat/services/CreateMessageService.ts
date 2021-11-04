import { injectable, inject } from 'tsyringe';

import IMessagesRepository from '../repositories/IMessagesRepository';

import Message from '../infra/typeorm/schemas/Message';

interface IRequest {
  text: string;
  recipient_id: string;
  advertiser_id: string;
  chat_id: string;
}

@injectable()
class CreateMessageService {
  constructor(
    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,
  ) {}

  public async execute({
      text,
      recipient_id,
      advertiser_id,
      chat_id,
    }: IRequest): Promise<Message> {
    const message = await this.messagesRepository.create({
      text,
      recipient_id,
      advertiser_id,
      chat_id,
    });

    return message;
  }
}

export default CreateMessageService;
