import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ConfirmUserService from '@modules/users/services/ConfirmUserService';
import UpdateConfirmUserTokenService from '@modules/users/services/UpdateConfirmUserTokenService';

export default class ConfirmUserController {
  public async patch(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;

    const confirmUser = container.resolve(ConfirmUserService);

    await confirmUser.execute({ token });

    return response.json({
      message: 'Your account was successfully confirmed',
    });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.body;

    const updateUserToken = container.resolve(UpdateConfirmUserTokenService);

    await updateUserToken.execute(user_id);

    return response.json({ message: 'New e-mail confirmation was sent.' });
  }
}
