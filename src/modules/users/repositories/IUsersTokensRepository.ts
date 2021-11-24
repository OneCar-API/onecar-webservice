import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUsersTokensRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  findByUserToken(user_id: string): Promise<UserToken | undefined>;
  update(userToken: UserToken): Promise<UserToken | undefined>;
}
