import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/User';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
  name: string;
  nickname: string;
  document: string;
  cnpj?: string;
  email: string;
  password: string;
  phone?: string;
}


@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
      name,
      nickname,
      document,
      cnpj,
      email,
      phone,
      password,
    }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError('Email address already in use.', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      document,
      cnpj,
      email,
      password: hashedPassword,
      phone,
      is_legal: cnpj ? true : false,
      is_active: false,
    });

    const { token } = await this.usersTokensRepository.generate(user.id);

      const confirmUser = path.resolve(
        __dirname,
        '..',
        'views',
        'confirm_user.hbs',
      );

      await this.mailProvider.sendMail({
        to: {
          name: user.name,
          email: user.email,
        },
        subject: '[OneCar] Confirmação de Cadastro',
        templateData: {
          file: confirmUser,
          variables: {
            name: user.name,
            link: `${process.env.APP_WEB_URL}/confirm-user?token=${token}`,
          },
        },
      });

    return user;
  }
}

export default CreateUserService;
