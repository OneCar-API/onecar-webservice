import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateAdsService from '@modules/ads/services/CreateAdsService';
import ImportContributorsAttachmentsService from '@modules/ads/services/ImportContributorsAttachmentsService';
import { string } from 'yup/lib/locale';
import AppError from '@shared/errors/AppError';

export default class ContributorsAttachmentsController {
  public async import(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { company_id } = request.params;

    const { confirm_import } = request.query;

    const { file } = request;

    const importContributorsAttachments = container.resolve(
      ImportContributorsAttachmentsService,
    );

    if (!file) {
      throw new AppError("file atributte does not exists on this request");
    }

    const contributorsAttachmentsFailed = await importContributorsAttachments.execute(
      file,
      user_id,
      company_id,
      confirm_import === 'true',
    );

    return response.status(200).json({
      message: 'Your file has been imported!',
      contributorsAttachmentsFailed,
    });
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { company_id, collaborator_id } = request.params;

    const { type, title, description } = request.body;

    const createContributorsAttachment = container.resolve(
      CreateAdsService,
    );

    if (request.file) {
      const attachmentFilename = request.file.filename;
      const collaboratorAttachmentFilename = await CreateAdsService.execute(
        {
          user_id,
          company_id,
          collaborator_id,
          attachmentFilename,
          type,
          title,
          description,
        },
      );
      return response.json(classToClass(collaboratorAttachmentFilename));
    }
    throw new AppError("file atributte does not exist on this request");
  }
}
