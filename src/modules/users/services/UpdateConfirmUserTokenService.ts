import AppError from '@shared/errors/AppError';
import path from 'path';

import { injectable, inject } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersTokensRepository from '../repositories/IUsersTokensRepository';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class UpdateConfirmUserTokenService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(user_id: string): Promise<void> {
    const userToken = await this.usersTokensRepository.findByUserToken(user_id);

    if (!userToken) {
      throw new AppError('User token does not exists.', 404);
    }

    const user = await this.usersRepository.findById(
      userToken.user_id,
    );

    if (!user) {
      throw new AppError('User does not exists.', 404);
    }

    userToken.updated_at = new Date();

    const updateToken = await this.usersTokensRepository.update(userToken);

    const confirmUserTemplate = path.resolve(
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
      subject: '[OneCar] Link Atualizado Para Confirmação',
      templateData: {
        file: confirmUserTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/confirm-user?token=${updateToken?.token}`,
        },
      },
    });

    await this.usersRepository.save(user);
  }
}

export default UpdateConfirmUserTokenService;
