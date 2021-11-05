import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersTokensRepository from '@modules/users/repositories/IUsersTokensRepository';
import UsersTokensRepository from '@modules/users/infra/typeorm/repositories/UsersTokensRepository';
import IAddressesRepository from '@modules/addresses/repositories/IAddressesRepository';
import AddressesRepository from '@modules/addresses/infra/typeorm/repositories/AddressesRepository';
import IAdsRepository from '@modules/adverts/repositories/IAdsRepository';
import AdsRepository from '@modules/adverts/infra/typeorm/repositories/AdsRepository';
import ICarsRepository from '@modules/adverts/repositories/ICarsRepository';
import CarsRepository from '@modules/adverts/infra/typeorm/repositories/CarsRepository';
import IVehicleItemsRepository from '@modules/adverts/repositories/IVehicleItemsRepository';
import VehicleItemsRepository from '@modules/adverts/infra/typeorm/repositories/VehicleItemsRepository';
import ICarsImagesRepository from '@modules/adverts/repositories/ICarsImagesRpository';
import CarsImagesRepository from '@modules/adverts/infra/typeorm/repositories/CarsImagesRepository';
import IMessagesRepository from '@modules/chat/repositories/IMessagesRepository';
import MessagesRepository from '@modules/chat/infra/typeorm/repositories/MessagesRepository';


container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IAdsRepository>(
  'AdsRepository',
  AdsRepository,
);

container.registerSingleton<ICarsRepository>(
  'CarsRepository',
  CarsRepository,
);

container.registerSingleton<ICarsImagesRepository>(
  'CarsImagesRepository',
  CarsImagesRepository,
);

container.registerSingleton<IVehicleItemsRepository>(
  'VehicleItemsRepository',
  VehicleItemsRepository,
);

container.registerSingleton<IMessagesRepository>(
  'MessagesRepository',
  MessagesRepository,
);
