import { v4 as uuidV4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IImportUserDTO from '@modules/users/dtos/IImportUserDTO';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';
import User from '../../infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

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
    is_legal,
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
      is_legal,
    });

    this.users.push(user);

    return user;
  }

  public async create({
    name,
    nickname,
    email,
    phone,
    password,
    document,
    cnpj,
    is_legal,
    is_active,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: uuidV4(),
      name,
      nickname,
      email,
      phone,
      password,
      document,
      cnpj,
      is_legal,
      is_active,
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
    is_legal,
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
      is_legal,
    });

    this.users.push(updatedUser);

    return updatedUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
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


  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByNickname(nickname: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.nickname === nickname);

    return findUser;
  }

  public async findAll(
    offset?: number,
    limit?: number,
    filters?: {
      user?: string;
      address?: string;
    },
  ): Promise<[User[], number, boolean, boolean]> {
    const findUsers = this.users.filter(user => {
      if (
        (filters?.user && user.name === filters?.user) ||
        (filters?.address &&
          user.address.city === filters?.address) ||
        (offset && offset === offset) ||
        (limit && limit === limit)
      ) {
        return user;
      }

      return null;
    });

    const totalUsers = findUsers.length;

    let previous = true;

    let next = true;

    if (offset === 0) {
      previous = false;
    }

    if (limit && offset) {
      const existNextPage = limit + offset;

      if (existNextPage >= totalUsers) {
        next = false;
      }
    }

    return [findUsers, totalUsers, previous, next];
  }

  public async showUser(
    user_id: string,
  ): Promise<User | undefined> {
    const showUser = this.users.find(
      user => user.id === user_id,
    );

    return showUser;
  }

  public async delete(id: string): Promise<void> {
    const user = new User();

    this.users.find(ut => ut.id === id);

    this.users.splice(this.users.indexOf(user));
  }
}

export default FakeUsersRepository;
