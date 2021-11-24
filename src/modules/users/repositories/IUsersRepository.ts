import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IImportUserDTO from '../dtos/IImportUserDTO';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  import({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
    is_legal,
  }: IImportUserDTO): Promise<User>;
  create({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
    is_legal,
    is_active,
  }: ICreateUserDTO): Promise<User>;
  generateRandomPassword(): Promise<string>;
  update({
    user_id,
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
    is_legal,
  }: IUpdateUserDTO): Promise<User | undefined>;
  save(user: User): Promise<User>;
  agreeToSubscribeData(confirm_import: boolean): Promise<boolean>;
  findByDocument(document: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByNickname(nickname: string): Promise<User | undefined>;
  findAll(
    offset?: number,
    limit?: number,
    filters?: {
      user?: string;
      address?: string;
    },
  ): Promise<[User[], number, boolean, boolean]>
  showUser(
    user_id: string,
  ): Promise<User | undefined>;
  delete(id: string): Promise<void>;
}
