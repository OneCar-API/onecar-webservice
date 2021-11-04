import ICreateMessageDTO from '../dtos/ICreateMessageDTO';
import Message from '../infra/typeorm/schemas/Message';

export default interface IMessagesRepository {
  create({
    text,
    recipient_id,
    advertiser_id,
    chat_id,
  }: ICreateMessageDTO): Promise<Message>;
}
