import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ImportUsersService from '@modules/users/services/ImportUsersService';
import ListUsersService from '@modules/users/services/ListUsersService';
import { classToClass } from 'class-transformer';
import ShowUserService from '@modules/users/services/ShowUserService';

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

  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const users = container.resolve(ListUsersService);

    const allUsers = await users.execute();

    return response.json(classToClass(allUsers));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.params.id;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute(user_id);

    return response.json(classToClass(user));
  }
}
