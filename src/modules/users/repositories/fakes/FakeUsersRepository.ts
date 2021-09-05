import { v4 as uuidV4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
    is_juridic,
  }: ICreateUserDTO): Promise<User> {
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
      is_juridic,
    });

    this.users.push(user);

    return user;
  }
}

export default FakeUsersRepository;
