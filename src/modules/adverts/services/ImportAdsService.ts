/* eslint-disable consistent-return */
/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import csvParse from 'csv-parse';

import { container, inject, injectable } from 'tsyringe';

import objectIsEmpty from '@shared/defaultFunctions/functionObjectIsEmpty';

import CreateImportedAdService from './CreateImportedAdService';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICarsRepository from '../repositories/ICarsRepository';
import IAdsRepository from '../repositories/IAdsRepository';
import IVehicleItemsRepository from '../repositories/IVehicleItemsRepository';
import IImportAdsDTO from '../dtos/IImportAdsDTO';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProviders/models/IStorageProvider';
import ICarsImagesRepository from '../repositories/ICarsImagesRpository';

@injectable()
class ImportAdsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,

    @inject('VehicleItemsRepository')
    private vehicleItemsRepository: IVehicleItemsRepository,

    @inject('CarsRepository')
    private carsRepository: ICarsRepository,

    @inject('AdsRepository')
    private adsRepository: IAdsRepository,
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

  async formatCNPJ(cnpj: string | undefined): Promise<string | undefined> {
    if (!cnpj) {
      return undefined;
    }

    const cnpjCSV = cnpj
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');

    return cnpjCSV;
  }

  adsFailed: IImportAdsDTO[] = [];

  async loadUsers(file: Express.Multer.File): Promise<IImportAdsDTO[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);

      let ads: IImportAdsDTO[] = [];

      const parseFile = csvParse({
        from_line: 2,
        delimiter: ';',
      });

      stream.pipe(parseFile);

      parseFile
        .on('data', async line => {
          const [
            ad_cod,
            manufacturer,
            brand,
            model,
            year_manufacture,
            year_model,
            document,
            cnpj,
            price,
            image,
          ] = line;

          const ad = {
            ad_cod: ad_cod !== '' ? ad_cod : undefined,
            manufacturer: manufacturer !== '' ? manufacturer : undefined,
            brand: brand !== '' ? brand : undefined,
            model: model !== '' ? model : undefined,
            year_manufacture: year_manufacture !== '' ? year_manufacture : undefined,
            year_model: year_model !== '' ? year_model : undefined,
            document: document !== '' ? document : undefined,
            cnpj: cnpj !== '' ? cnpj : undefined,
            price: price !== '' ? price : undefined,
            image: image !== '' ? image : undefined,
          };

          ads = [ad, ...ads];
        })
        .on('end', () => {
          resolve(ads);
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  async execute(file: Express.Multer.File, userId: string): Promise<IImportAdsDTO[]> {
    const adsFile = await this.loadUsers(file);

    const createAdsService = container.resolve(CreateImportedAdService);

    adsFile.map(async ad => {
      const { ad_code, manufacturer, brand, model: modelResponse, year_manufacture, year_model,
        document, cnpj, price, image } = ad;

      const model = modelResponse;

      const user = await this.usersRepository.findById(userId);

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const importAds = await createAdsService.execute({
        ad_code,
        manufacturer,
        brand,
        model,
        year_manufacture,
        year_model,
        ...(document && { document }),
        ...(cnpj && { cnpj }),
        ...(price && { price }),
        user_id: user.id,
      });

      const fileName = `${importAds.id}-${model}`;

      const uploadImages = await this.storageProvider.saveLink(
        image,
        fileName,
      );

      await this.carsImagesRepository.create({
        car_id: importAds.car_id,
        image: uploadImages,
      });
    });

    return this.adsFailed;
  }
}

export default ImportAdsService;
