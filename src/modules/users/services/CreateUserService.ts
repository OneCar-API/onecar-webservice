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

    const checkNicknameExists = await this.usersRepository.findByNickname(nickname);

    if (checkNicknameExists) {
      throw new AppError('Nickname already in use.', 401);
    }

    const checkDocumentAlreadyInUse = await this.usersRepository.findByDocument(document);

    if (checkDocumentAlreadyInUse) {
      throw new AppError('Document already in use.', 401);
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    if (phone) {
      const isNumber = phone.match(/^\d+$/) !== null;

      if (!isNumber) {
        throw new AppError('Phone formatting is wrong.', 401);
      }
    }

    if (document) {
      const isNumber = document.match(/^\d+$/) !== null;

      if (!isNumber) {
        throw new AppError('Document formatting is wrong.', 401);
      }
    }

    if (cnpj) {
      const isNumber = cnpj.match(/^\d+$/) !== null;

      if (!isNumber) {
        throw new AppError('CNPJ formatting is wrong.', 401);
      }
    }

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
