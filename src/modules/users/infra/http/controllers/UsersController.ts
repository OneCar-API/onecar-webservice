import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ImportUsersService from '@modules/users/services/ImportUsersService';

export default class UsersController {
  public async import(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const importUsers = container.resolve(ImportUsersService);

    const usersFailed = await importUsers.execute(
      file as Express.Multer.File,
    );

    return response
      .status(200)
      .json({ message: 'Your file has been imported!', usersFailed });
  }
}
