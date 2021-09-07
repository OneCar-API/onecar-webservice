/* eslint-disable consistent-return */
/* eslint-disable no-console */
import csvParse from 'csv-parse';
import fs from 'fs';
import * as Yup from 'yup';
import cep from 'cep-promise';

import { inject, injectable } from 'tsyringe';

import objectIsEmpty from '@shared/defaultFunctions/functionObjectIsEmpty';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IAddressesRepository from '@modules/addresses/repositories/IAddressesRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

export interface IImportAddress {
  zip_code?: string;
  neighborhood?: string;
  state?: string;
  city?: string;
}

interface IImportUsers {
  name: string;
  nickname: string;
  email: string;
  phone?: string;
  document?: string;
  cnpj?: string;
  is_legal?: boolean;
  address?: IImportAddress;
}

interface IFormatDate {
  name: string;
  nickname: string;
  email: string;
  phone?: string;
  document?: string;
  cnpj?: string;
  is_legal?: boolean;
  address?: IImportAddress;
}

@injectable()
class ImportUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AddressesRepository')
    private addressesRepository: IAddressesRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async formatPhone(phone: string | undefined): Promise<string | undefined> {
    if (!phone) {
      return undefined;
    }

    const phoneCSV = phone
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    return phoneCSV;
  }

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

  async formatCNPJ(cnpj: string | undefined): Promise<string | undefined> {
    if (!cnpj) {
      return undefined;
    }

    const cnpjCSV = cnpj
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    return cnpjCSV;
  }

  async formatZipCode(
    zip_code: string | undefined,
  ): Promise<string | undefined> {
    if (!zip_code) {
      return undefined;
    }

    const zipCodeCSV = zip_code
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    return zipCodeCSV;
  }

  async formatAddress({
    zip_code,
  }: IImportAddress): Promise<IImportAddress | null> {
    const paramsAddress = await cep(zip_code).catch(() => null);

    if (!paramsAddress) {
      return null;
    }

    const addressFormatted = {
      neighborhood: paramsAddress.neighborhood,
      city: paramsAddress.city,
      state: paramsAddress.state,
      zip_code: paramsAddress.cep,
    };

    return addressFormatted;
  }

  usersFailed: IImportUsers[] = [];

  async loadUsers(file: Express.Multer.File): Promise<IImportUsers[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);

      let users: IImportUsers[] = [];

      const parseFile = csvParse({
        from_line: 2,
        delimiter: ';',
      });

      stream.pipe(parseFile);

      parseFile
        .on('data', async line => {
          const [
            name,
            nickname,
            email,
            phone,
            document,
            cnpj,
            zip_code,
            neighborhood,
            city,
            state,
          ] = line;

          const user = {
            name: name !== '' ? name : undefined,
            nickname: nickname !== '' ? nickname : undefined,
            document: document !== '' ? document : undefined,
            phone: phone !== '' ? phone : undefined,
            email: email !== '' ? email : undefined,
            cnpj: cnpj !== '' ? cnpj : undefined,
            address: {
              zip_code: zip_code !== '' ? zip_code : undefined,
              neighborhood: neighborhood !== '' ? neighborhood : undefined,
              city: city !== '' ? city : undefined,
              state: state !== '' ? state : undefined,
            },
          };

          users = [user, ...users];
        })
        .on('end', () => {
          resolve(users);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  async formatUsers(usersFile: IImportUsers[]): Promise<IFormatDate[]> {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
    });

    const usersFormatted = Promise.all(
      usersFile
        .filter(async user => {
          if (!(await schema.isValid(user))) {
            this.usersFailed = [user, ...this.usersFailed];

            return;
          }

          return user;
        })
        .map(async user => {
          const { document, phone, cnpj, address } = user;

          const userFormatted: IFormatDate = {
            ...user,
            document: await this.formatDocument(document),
            phone: await this.formatPhone(phone),
            cnpj: await this.formatCNPJ(cnpj),
            address: {
              ...address,
              zip_code: await this.formatZipCode(address?.zip_code),
            },
          };

          return userFormatted;
        }),
    );

    return usersFormatted;
  }

  async execute(file: Express.Multer.File): Promise<IImportUsers[]> {
    const usersFile = await this.loadUsers(file);

    const users = await this.formatUsers(usersFile);

    users.map(async user => {
      const { name, nickname, email, phone, document, cnpj, address } = user;

      const randomPassword =
        await this.usersRepository.generateRandomPassword();

      const hashedPassword = await this.hashProvider.generateHash(
        randomPassword,
      );

      const importUser = await this.usersRepository.import({
        name,
        nickname,
        email,
        password: hashedPassword,
        ...(document && { document }),
        ...(cnpj && { cnpj }),
        ...(phone && { phone }),
      });

      if (address?.zip_code) {
        const formattedAddress = await this.formatAddress(address);

        if (
          objectIsEmpty(formattedAddress) ||
          formattedAddress?.zip_code === null
        ) {
          return;
        }

        await this.addressesRepository.create({
          user_id: importUser.id,
          zip_code: formattedAddress?.zip_code,
          neighborhood: formattedAddress?.neighborhood,
          city: formattedAddress?.city,
          state: formattedAddress?.state,
        });
      }
    });

    return this.usersFailed;
  }
}

export default ImportUsersService;
