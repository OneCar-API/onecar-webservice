import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';
import IEncryptionProvider from '@shared/container/providers/EncryptionProvider/models/IEncryptionProvider';

interface IResponse {
  name: string;
  nickname: string;
  document: string;
  cnpj?: string;
  email: string;
  phone?: string;
}
@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EncryptionProvider')
    private encryptionProvider: IEncryptionProvider,
  ) {}

  public async execute(user_id: string): Promise<IResponse> {
    const user = await this.usersRepository.showUser(user_id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const decryptName = await this.encryptionProvider.decrypt(user.name);
    const decryptNickname = await this.encryptionProvider.decrypt(user.nickname);
    const decryptDocument = await this.encryptionProvider.decrypt(user.document);
    const decryptCNPJ = await this.encryptionProvider.decrypt(user.cnpj);
    const decryptEmail = await this.encryptionProvider.decrypt(user.email);
    const decryptPhone = await this.encryptionProvider.decrypt(user.phone);

    const responseFormatted = {
      name: decryptName,
      nickname: decryptNickname,
      document: decryptDocument,
      cnpj: decryptCNPJ,
      email: decryptEmail,
      phone: decryptPhone,
    }

    return responseFormatted;
  }
}

export default ShowUserService;
