import path from 'path';
import { injectable, inject } from 'tsyringe';
import { differenceInDays } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IAdsRepository from '../repositories/IAdsRepository';

interface IRequest {
  user_id: string;
  ad_id: string;
}

interface IResponse {
  ad_id: string;
  time: number,
  interests: number,
  views: number,
}

@injectable()
class GenerateAdReportService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
      user_id,
      ad_id,
    }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const ad = await this.adsRepository.findById(ad_id);

    if (!ad) {
      throw new AppError('Ad not found.', 404);
    }

    if (ad.user_id !== user.id) {
      throw new AppError('This ad does not belong to you.', 403);
    }

    const getAdCreatedDate = ad.created_at;

    const onlineAdTime = differenceInDays(Date.now(), getAdCreatedDate);


    const averageOfInterestsPerDay = Math.round(ad.interests / onlineAdTime);

    const averageViewsPerDay = Math.round(ad.views / onlineAdTime);

    const report = {
      ad_id: ad.id,
      time: onlineAdTime,
      interests: averageOfInterestsPerDay,
      views: averageViewsPerDay,
    }

    const reportAd = path.resolve(
      __dirname,
      '..',
      'views',
      'report.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: '[OneCar] Relatório do Anúncio',
      templateData: {
        file: reportAd,
        variables: {
          name: user.name,
          time: report.time,
          interests: report.interests,
          views: report.views,
        },
      },
    });

    return report;

  }
}

export default GenerateAdReportService;
