import { Brackets, getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUpdateUserDTO from '@modules/users/dtos/IUpdateUserDTO';
import IImportUserDTO from '@modules/users/dtos/IImportUserDTO';
import User from '../entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

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
    const user = this.ormRepository.create({
      name,
      nickname,
      email,
      password,
      phone,
      document,
      cnpj,
      is_legal,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async create({
    name,
    nickname,
    document,
    cnpj,
    email,
    phone,
    password,
    is_legal,
    is_active,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      name,
      nickname,
      document,
      cnpj,
      email,
      phone,
      password,
      is_legal,
      is_active,
    });

    await this.ormRepository.save(user);

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
    phone,
    password,
    document,
    cnpj,
    is_legal,
  }: IUpdateUserDTO): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { user_id },
    });

    const updateUser = Object.assign(user, {
      name,
      nickname,
      email,
      phone,
      password,
      document,
      cnpj,
      is_legal,
    });

    await this.ormRepository.save(updateUser);

    return updateUser;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    const contactQuery = this.ormRepository.createQueryBuilder();

    if (confirm_import) {
      contactQuery.andWhere('confirm_import = :confirm_import', {
        confirm_import: true,
      });
    }

    return confirm_import;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { document },
    });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.ormRepository.findOne(id);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }

  public async findAll(
    offset?: number,
    limit?: number,
    filters?: {
      user?: string;
      address?: string;
    },
  ): Promise<[User[], number, boolean, boolean]> {
    const usersQuery = this.ormRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.address', 'address')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phone',
        'user.created_at',
        'address.id',
        'address.city',
        'address.state',
      ])
      .skip(offset || (offset = 0))
      .take(limit || (limit = 20))
      .orderBy('user.created_at', 'DESC');

    if (filters?.user) {
      usersQuery.andWhere(
        new Brackets(qb => {
          qb.where('user.name like :name', {
            name: `%${filters.user}%`,
          })
            .orWhere('user.email like :email', {
              email: `%${filters.user}%`,
            })
            .orWhere('user.phone like :phone', {
              phone: `%${filters.user}%`,
            })
        }),
      );
    }

    if (filters?.address) {
      usersQuery.andWhere(
        new Brackets(qb => {
          qb.where('address.city like :city', {
            city: `%${filters.address}%`,
          })
            .orWhere('address.state like :state', {
              state: `%${filters.address}%`,
            });
        }),
      );
    }

    const [users, totalUsers] = await usersQuery.getManyAndCount();

    let previous = true;

    let next = true;

    if (offset === 0) {
      previous = false;
    }

    if (limit) {
      if (offset === 0 || (offset && offset !== 0)) {
        const existNextPage = limit + offset;

        if (existNextPage >= totalUsers) {
          next = false;
        }
      }
    }

    return [users, totalUsers, previous, next];
  }

  public async showUser(
    user_id: string,
  ): Promise<User | undefined> {
    const user = await this.ormRepository
      .createQueryBuilder('user')
      .where('user.id = :user_id', { user_id })
      .leftJoinAndSelect('user.address', 'address')
      .select([
        'user.id',
        'user.name',
        'user.nickname',
        'user.email',
        'user.phone',
        'user.document',
        'user.cnpj',
        'user.is_legal',
        'user.is_active',
        'user.created_at',
        'user.updated_at',
        'address.id',
        'address.zip_code',
        'address.neighborhood',
        'address.city',
        'address.state',
      ])
      .getOne();

    return user;
  }
}

export default UsersRepository;
