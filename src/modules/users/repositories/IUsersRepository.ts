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
  }: IImportUserDTO): Promise<User>;
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
    is_juridic,
  }: IUpdateUserDTO): Promise<User | undefined>;
  agreeToSubscribeData(confirm_import: boolean): Promise<boolean>;
  findByDocument(document: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
