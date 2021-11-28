import { container, injectable, inject} from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import DeleteAdService from '../../adverts/services/DeleteAdService';
import ListAdsByUserService from '../../adverts/services/ListAdsByUserService';

interface IRequest {
  user_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
  }: IRequest): Promise<void> {
    const user = await this.usersRepository.findById(
      user_id,
    );

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    await this.usersRepository.delete(user.id);

    const listAdsByUserService = container.resolve(ListAdsByUserService);

    const userAds = await listAdsByUserService.execute(user.id);

    const deleteAdService = container.resolve(DeleteAdService);

    for (const ad of userAds) {
      deleteAdService.execute(ad.id, user.id);
    }


  }
}

export default DeleteUserService;
