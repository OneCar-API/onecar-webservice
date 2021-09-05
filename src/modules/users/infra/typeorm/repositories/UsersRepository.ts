import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

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
    const user = this.ormRepository.create({
      name,
      nickname,
      email,
      password,
      phone,
      document,
      cnpj,
      is_juridic,
    });

    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;
