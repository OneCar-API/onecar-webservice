import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateMessageService from '@modules/chat/services/CreateMessageService';

export default class MessagesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      text,
      recipient_id,
      advertiser_id,
      chat_id,
    } = request.body;

    const createMessage = container.resolve(CreateMessageService);

    const message = await createMessage.execute({
      text,
      recipient_id,
      advertiser_id,
      chat_id,
    });

    return response.json(message);
  }
}
