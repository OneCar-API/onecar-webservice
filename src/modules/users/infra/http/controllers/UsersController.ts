import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ImportUsersService from '@modules/users/services/ImportUsersService';
import ListUsersService from '@modules/users/services/ListUsersService';
import { classToClass } from 'class-transformer';
import ShowUserService from '@modules/users/services/ShowUserService';
import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      name,
      nickname,
      document,
      cnpj,
      email,
      phone,
      password,
      is_legal,
    } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      nickname,
      document,
      cnpj,
      email,
      password,
      phone,
      is_legal,
    });

    return response.json(classToClass(user));
  }

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

    const {
      user,
      address,
      offset,
      limit,
    } = request.query;


    const listUser = container.resolve(ListUsersService);

    const users = await listUser.execute({
      filters: {
        user: user as string,
        address: address as string,
      },
      offset: Number(offset),
      limit: Number(limit),
      user_id,
    });

    return response.json(classToClass(users));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.params.id;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute(user_id);

    return response.json(classToClass(user));
  }
}
