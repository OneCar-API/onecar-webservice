import { getRepository, Repository } from 'typeorm';

import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';

import UserToken from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({
      where: { token },
    });

    return userToken;
  }

  public async findByUserToken(
    user_id: string,
  ): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ user_id });

    return userToken;
  }

  public async update(userToken: UserToken): Promise<UserToken | undefined> {
    return this.ormRepository.save(userToken);
  }
}

export default UsersTokensRepository;
