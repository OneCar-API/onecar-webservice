import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeUserCompaniesRepository from '@modules/companies/repositories/fakes/FakeUserCompaniesRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCompaniesRepository from '@modules/companies/repositories/fakes/FakeCompaniesRepository';
import FakeContributorsRepository from '@modules/contributors/repositories/fakes/FakeContributorsRepository';
import FakeContactsRepository from '@modules/contacts/repositories/fakes/FakeContactsRepository';
import FakeStatusRepository from '@modules/contributors/repositories/fakes/FakeStatusRepository';
import FakeContributorsAttachmentsRepository from '../repositories/fakes/FakeContributorsAttachmentsRepository.ts';
import CreateCollaboratorAttachmentService from './CreateCollaboratorAttachmentService';

let fakeContributorsAttachmentsRepository: FakeContributorsAttachmentsRepository;
let fakeContributorsRepository: FakeContributorsRepository;
let fakeContactsRepository: FakeContactsRepository;
let fakeStatusRepository: FakeStatusRepository;
let fakeUserCompaniesRepository: FakeUserCompaniesRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeCompaniesRepository: FakeCompaniesRepository;

let createCollaboratorAttachment: CreateCollaboratorAttachmentService;

describe('CreateAds', () => {
  beforeEach(() => {
    fakeContributorsAttachmentsRepository = new FakeContributorsAttachmentsRepository();
    fakeContributorsRepository = new FakeContributorsRepository();
    fakeContactsRepository = new FakeContactsRepository();
    fakeStatusRepository = new FakeStatusRepository();
    fakeUserCompaniesRepository = new FakeUserCompaniesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCompaniesRepository = new FakeCompaniesRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createCollaboratorAttachment = new CreateCollaboratorAttachmentService(
      fakeContributorsRepository,
      fakeContributorsAttachmentsRepository,
      fakeUserCompaniesRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to create a new collaborator attachment', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const company = await fakeCompaniesRepository.create({
      name: 'Company 02',
    });

    const userCompany = await fakeUserCompaniesRepository.create({
      user_id: user.id,
      company_id: company.id,
    });

    const contact = await fakeContactsRepository.create({
      user_id: userCompany.user_id,
      company_id: userCompany.company_id,
      name: 'Jose Bradley',
      document: '22287634090',
      email: 'josebradley@example.com',
      phone: '12988239090',
      person_type: 'physicalPerson',
      gender: 'male',
      birth: new Date('2000-04-17'),
    });

    const status = await fakeStatusRepository.create({
      company_id: userCompany.company_id,
      title: 'Under Review',
      description: 'Registration approval required.',
      color: 'gold',
      type: 'under review',
    });

    const collaborator = await fakeContributorsRepository.create({
      company_id: userCompany.company_id,
      contact_id: contact.id,
      status_id: status.id,
      evaluation: 0,
    });

    const collaboratorAttachment = await createCollaboratorAttachment.execute({
      user_id: userCompany.user_id,
      company_id: userCompany.company_id,
      collaborator_id: collaborator.id,
      attachmentFilename: 'attachment.jpg',
      type: 'image',
      title: 'ID front',
      description: 'Scanning of the front of the ID',
    });

    expect(collaboratorAttachment.attachment).toBe('attachment.jpg');
  });

  it('should not be able to create a new collaborator attachment if company is not yours', async () => {
    const contact = await fakeContactsRepository.create({
      user_id: 'user_id',
      company_id: 'company_id',
      name: 'Jose Bradley',
      document: '22287634090',
      email: 'josebradley@example.com',
      phone: '12988239090',
      person_type: 'physicalPerson',
      gender: 'male',
      birth: new Date('2000-04-17'),
    });

    const status = await fakeStatusRepository.create({
      company_id: 'company_id',
      title: 'Under Review',
      description: 'Registration approval required.',
      color: 'gold',
      type: 'under review',
    });

    const collaborator = await fakeContributorsRepository.create({
      company_id: 'company_id',
      contact_id: contact.id,
      status_id: status.id,
      evaluation: 0,
    });

    await expect(
      createCollaboratorAttachment.execute({
        user_id: 'user_id',
        company_id: 'company_id',
        collaborator_id: collaborator.id,
        attachmentFilename: 'attachment.jpg',
        type: 'image',
        title: 'ID front',
        description: 'Scanning of the front of the ID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create attachment from non-existent collaborator', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const company = await fakeCompaniesRepository.create({
      name: 'Company 02',
    });

    const userCompany = await fakeUserCompaniesRepository.create({
      user_id: user.id,
      company_id: company.id,
    });

    expect(
      createCollaboratorAttachment.execute({
        user_id: userCompany.user_id,
        company_id: userCompany.company_id,
        collaborator_id: 'non-existent collaborator',
        attachmentFilename: 'attachment.jpg',
        type: 'image',
        title: 'ID front',
        description: 'Scanning of the front of the ID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create attachment from non-existent type', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@example.com',
      password: '123456',
    });

    const company = await fakeCompaniesRepository.create({
      name: 'Company 01',
    });

    const userCompany = await fakeUserCompaniesRepository.create({
      user_id: user.id,
      company_id: company.id,
    });

    const contact = await fakeContactsRepository.create({
      user_id: userCompany.user_id,
      company_id: userCompany.company_id,
      name: 'Jose Bradley',
      document: '22287634090',
      email: 'josebradley@example.com',
      phone: '12988239090',
      person_type: 'physicalPerson',
      gender: 'male',
      birth: new Date('2000-04-17'),
    });

    const status = await fakeStatusRepository.create({
      company_id: userCompany.company_id,
      title: 'Under Review',
      description: 'Registration approval required.',
      color: 'gold',
      type: 'under review',
    });

    const collaborator = await fakeContributorsRepository.create({
      company_id: userCompany.company_id,
      contact_id: contact.id,
      status_id: status.id,
      evaluation: 0,
    });

    expect(
      createCollaboratorAttachment.execute({
        user_id: userCompany.user_id,
        company_id: userCompany.company_id,
        collaborator_id: collaborator.id,
        attachmentFilename: 'attachment.jpg',
        type: 'non-existent type',
        title: 'ID front',
        description: 'Scanning of the front of the ID',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
