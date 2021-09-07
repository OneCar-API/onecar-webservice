import { v4 as uuidV4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IImportUserDTO from '@modules/users/dtos/IImportUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async import({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
  }: IImportUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuidV4(),
      name,
      nickname,
      email,
      password,
      phone,
      document,
      cnpj,
    });

    this.users.push(user);

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
    password,
    phone,
    document,
    cnpj,
    is_juridic,
  }: IUpdateUserDTO): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === user_id);

    const updatedUser = Object.assign(findUser, {
      name,
      nickname,
      email,
      password,
      phone,
      document,
      cnpj,
      is_juridic,
    });

    this.users.push(updatedUser);

    return updatedUser;
  }

  public async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    this.users.find(user => user.confirm_import === confirm_import);

    return confirm_import;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.document === document);

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }
}

export default FakeUsersRepository;
