import { v4 as uuidV4 } from 'uuid';

import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUsersTokensRepository implements IUsersTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuidV4(),
      token: uuidV4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(
      findToken => findToken.token === token,
    );

    return userToken;
  }

  public async findByUserToken(
    user_id: string,
  ): Promise<UserToken | undefined> {
    const findUser = this.userTokens.find(user => user.id === user_id);

    return findUser;
  }

  public async update(userToken: UserToken): Promise<UserToken | undefined> {
    const updateUserToken = new UserToken();

    this.userTokens.push(userToken);

    return updateUserToken;
  }
}

export default FakeUsersTokensRepository;
