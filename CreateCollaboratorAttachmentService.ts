import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import IUserCompaniesRepository from '@modules/companies/repositories/IUserCompaniesRepository';
import IContributorsRepository from '@modules/contributors/repositories/IContributorsRepository';
import IContributorsAttachmentsRepository from '../repositories/IContributorsAttachmentsRepository';

import CollaboratorAttachment from '../infra/typeorm/entities/CollaboratorAttachment';

interface IRequest {
  user_id: string;
  company_id: string;
  collaborator_id: string;
  attachmentFilename: string;
  type: string;
  title: string;
  description: string;
}

@injectable()
class CreateCollaboratorAttachmentService {
  constructor(
    @inject('ContributorsRepository')
    private contributorsRepository: IContributorsRepository,

    @inject('ContributorsAttachmentsRepository')
    private contributorsAttachmentsRepository: IContributorsAttachmentsRepository,

    @inject('UserCompaniesRepository')
    private userCompaniesRepository: IUserCompaniesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    company_id,
    collaborator_id,
    attachmentFilename,
    type,
    title,
    description,
  }: IRequest): Promise<CollaboratorAttachment> {
    const userCompany = await this.userCompaniesRepository.findUserCompany(
      user_id,
      company_id,
    );

    if (
      userCompany?.user_id !== user_id &&
      userCompany?.company_id !== company_id
    ) {
      throw new AppError('This company is not yours.', 403);
    }

    const collaborator = await this.contributorsRepository.findById(
      collaborator_id,
    );

    if (!collaborator) {
      throw new AppError('Collaborator not found.', 404);
    }

    if (
      type !== 'image' &&
      type !== 'video' &&
      type !== 'audio' &&
      type !== 'application' &&
      type !== 'text'
    ) {
      throw new AppError('That type does not exist.', 401);
    }

    const filename = await this.storageProvider.saveFile(
      attachmentFilename,
      'attachment',
    );

    const createCollaboratorAttachment = await this.contributorsAttachmentsRepository.create(
      {
        company_id: userCompany.company_id,
        collaborator_id: collaborator.id,
        attachment: filename,
        type,
        title,
        description,
      },
    );

    return createCollaboratorAttachment;
  }
}

export default CreateCollaboratorAttachmentService;
