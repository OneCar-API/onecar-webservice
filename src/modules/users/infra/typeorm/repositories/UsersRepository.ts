import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';
import IImportUserDTO from '@modules/users/dtos/IImportUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async import({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
  }: IImportUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      nickname,
      email,
      password,
      phone,
      document,
      cnpj,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async generateRandomPassword(): Promise<string> {
    const randomPassword = Math.random().toString(36).slice(-8);

    return randomPassword;
  }

  public async update({
    user_id,
    name,
    nickname,
    email,
    phone,
    password,
    document,
    cnpj,
    is_juridic,
  }: IUpdateUserDTO): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { user_id },
    });

    const updateUser = Object.assign(user, {
      name,
      nickname,
      email,
      phone,
      password,
      document,
      cnpj,
      is_juridic,
    });

    await this.ormRepository.save(updateUser);

    return updateUser;
  }

  public async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    const contactQuery = this.ormRepository.createQueryBuilder();

    if (confirm_import) {
      contactQuery.andWhere('confirm_import = :confirm_import', {
        confirm_import: true,
      });
    }

    return confirm_import;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { document },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);

    return user;
  }
}

export default UsersRepository;
