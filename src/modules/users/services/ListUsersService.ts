import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  offset?: number;
  limit?: number;
  filters?: {
    user?: string;
    address?: string;
  };
}

interface IResponse {
  total: number;
  results: User[];
}

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    filters,
    offset,
    limit,
  }: IRequest): Promise<IResponse> {
    const [
      users,
      totalUsers,
      previous,
      next,
    ] = await this.usersRepository.findAll(
      offset,
      limit,
      filters,
    );

    const responseFormatted = {
      total: totalUsers,
      previous,
      next,
      results: users,
    };

    return responseFormatted;

  }
}

export default ListUsersService;
