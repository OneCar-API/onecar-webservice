/* eslint-disable no-lonely-if */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
import csvParse from 'csv-parse';
import fs from 'fs';
import * as Yup from 'yup';

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IContactsRepository from '@modules/contacts/repositories/IContactsRepository';
import IUserCompaniesRepository from '@modules/companies/repositories/IUserCompaniesRepository';
import IContributorsRepository from '@modules/contributors/repositories/IContributorsRepository';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import IContributorsAttachmentsRepository from '../repositories/IContributorsAttachmentsRepository';

interface IImportAdsInterface {
  ad_code?: string;
  manufacturer?: string;
  brand?: string;
  model?: string;
  year_manufacture?: string;
  year_model?: string;
  document?: string;
  cnpj?: string;
  vehicle_price?: string;
}

@injectable()
class ImportContributorsAttachmentsService {
  constructor(
    @inject('ContributorsRepository')
    private contributorsRepository: IContributorsRepository,

    @inject('ContactsRepository')
    private contactsRepository: IContactsRepository,

    @inject('UserCompaniesRepository')
    private userCompaniesRepository: IUserCompaniesRepository,

    @inject('ContributorsAttachmentsRepository')
    private contributorsAttachmentsRepository: IContributorsAttachmentsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async formatDocument(
    document: string | undefined,
  ): Promise<string | undefined> {
    if (!document) {
      return undefined;
    }

    const documentCSV = document
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    return documentCSV;
  }

  async formatType(type: string | undefined): Promise<string | undefined> {
    if (!type) {
      return undefined;
    }

    const typeCSV = type
      .toLowerCase()
      .normalize('NFD')
      .replace(/([\u0300-\u036f])/g, '');

    let formattedType = 'text';

    if (typeCSV === 'documento') {
      formattedType = 'application';
    }

    if (typeCSV === 'imagem') {
      formattedType = 'image';
    }

    if (typeCSV === 'video') {
      formattedType = 'video';
    }

    if (typeCSV === 'audio') {
      formattedType = 'audio';
    }

    return formattedType;
  }

  contributorsAttachmentsFailed: IImportAdsInterface[] = [];

  async loadContributors(
    file: Express.Multer.File,
  ): Promise<IImportAdsInterface[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);

      let contributorsAttachments: IImportAdsInterface[] = [];

      const parseFile = csvParse({
        from_line: 2,
        delimiter: ';',
      });

      stream.pipe(parseFile);

      parseFile
        .on('data', async line => {
          const [document, title, description, type, attachment] = line;

          const collaboratorAttachment = {
            document: document !== '' ? document : undefined,
            title: title !== '' ? title : undefined,
            description: description !== '' ? description : undefined,
            type: type !== '' ? type : undefined,
            attachment: attachment !== '' ? attachment : undefined,
          };

          contributorsAttachments = [
            collaboratorAttachment,
            ...contributorsAttachments,
          ];
        })
        .on('end', () => {
          resolve(contributorsAttachments);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  async formatContributorsAttachments(
    contributorsFile: IImportAdsInterface[],
  ): Promise<IImportAdsInterface[]> {
    const schema = Yup.object().shape({
      document: Yup.string().required(),
    });

    const contributorsAttachmentsFormatted = Promise.all(
      contributorsFile
        .filter(async collaboratorAttachment => {
          if (!(await schema.isValid(collaboratorAttachment))) {
            this.contributorsAttachmentsFailed = [
              collaboratorAttachment,
              ...this.contributorsAttachmentsFailed,
            ];

            return;
          }

          return collaboratorAttachment;
        })
        .map(async collaboratorAttachment => {
          const { document, type } = collaboratorAttachment;

          const collaboratorAttachmentFormatted: IImportAdsInterface = {
            ...collaboratorAttachment,
            document: await this.formatDocument(document),
            type: await this.formatType(type),
          };

          return collaboratorAttachmentFormatted;
        }),
    );

    return contributorsAttachmentsFormatted;
  }

  async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    const agreeToSubscribe = await this.contactsRepository.agreeToSubscribeData(
      confirm_import,
    );

    if (agreeToSubscribe) {
      return true;
    }

    return false;
  }

  async execute(
    file: Express.Multer.File,
    user_id: string,
    company_id: string,
    confirm_import: boolean,
  ): Promise<IImportAdsInterface[]> {
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

    const contributorsFile = await this.loadContributors(file);

    const contributors = await this.formatContributorsAttachments(
      contributorsFile,
    );

    contributors.map(async collaboratorAttachment => {
      const {
        document,
        title: titleResponse,
        description,
        type,
        attachment,
      } = collaboratorAttachment;

      const title = titleResponse;

      const agreeToSubscribe = confirm_import;

      if (!attachment) {
        throw new AppError('The file has no attachment.', 404);
      }

      if (!title) {
        throw new AppError(
          'The attachment has no title. You need to add one to continue.',
          401,
        );
      }

      if (document) {
        const existContact = await this.contactsRepository.findIfExistThisDocumentInCompany(
          userCompany.company_id,
          document,
        );

        if (existContact) {
          const findCollaborator = await this.contributorsRepository.findByContactId(
            existContact.id,
          );

          if (findCollaborator) {
            const fileName = `${findCollaborator.id}-${title}`;

            const findCollaboratorAttachments = await this.contributorsAttachmentsRepository.findByTitle(
              title,
            );

            const findCollaboratorAttachment = findCollaboratorAttachments[0];

            if (agreeToSubscribe) {
              if (findCollaboratorAttachment) {
                const uploadAttachment = await this.storageProvider.saveLink(
                  attachment,
                  'attachment',
                  fileName,
                );

                const updatedAttachment = await this.contributorsAttachmentsRepository.update(
                  {
                    collaborator_attachment_id: findCollaboratorAttachment.id,
                    ...(title && { title }),
                    description,
                    ...(type && { type }),
                    ...(attachment && { attachment: uploadAttachment }),
                  },
                );

                return updatedAttachment;
              }
            } else {
              const uploadAttachment = await this.storageProvider.saveLink(
                attachment,
                'attachment',
                fileName,
              );

              const importAttachment = await this.contributorsAttachmentsRepository.import(
                {
                  company_id: userCompany.company_id,
                  collaborator_id: findCollaborator.id,
                  ...(title && { title }),
                  description,
                  ...(type && { type }),
                  ...(attachment && { attachment: uploadAttachment }),
                },
              );

              return importAttachment;
            }

            const uploadAttachment = await this.storageProvider.saveLink(
              attachment,
              'attachment',
              fileName,
            );

            await this.contributorsAttachmentsRepository.import({
              company_id: userCompany.company_id,
              collaborator_id: findCollaborator.id,
              ...(title && { title }),
              description,
              ...(type && { type }),
              ...(attachment && { attachment: uploadAttachment }),
            });
          }
        }
      }
    });

    return this.contributorsAttachmentsFailed;
  }
}

export default ImportContributorsAttachmentsService;
