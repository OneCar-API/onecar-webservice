import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  name: string;
  nickname: string;
  document: string;
  email: string;
  password: string;
}


@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, nickname, document, email, password }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already in use.', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      document,
      email,
      password: hashedPassword,
      is_legal: false,
    });

    return user;
  }
}

export default CreateUserService;
