import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  create({
    name,
    nickname,
    email,
    password,
    phone,
    document,
    cnpj,
    is_juridic,
  }: ICreateUserDTO): Promise<User>;
}
