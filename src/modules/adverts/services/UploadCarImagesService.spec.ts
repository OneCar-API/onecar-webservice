import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProviders/fakes/FakeStorageProvider';
import FakeCarsRepository from '@modules/adverts/repositories/fakes/FakeCarsRepository';
import FakeCarsImagesRepository from '@modules/adverts/repositories/fakes/FakeCarsImagesRepository';
import UploadCarImagesService from './UploadCarImagesService';
import FakeVehicleItemsRepository from '@modules/adverts/repositories/fakes/FakeVehicleItemsRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

let fakeCarsImagesRepository: FakeCarsImagesRepository;
let fakeCarsRepository: FakeCarsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeVehicleItemsRepository: FakeVehicleItemsRepository;
let fakeStorageProvider: FakeStorageProvider;

let createCarImages: UploadCarImagesService;

describe('UploadCarImages', () => {
  beforeEach(() => {
    fakeCarsImagesRepository = new FakeCarsImagesRepository();
    fakeCarsRepository = new FakeCarsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeVehicleItemsRepository = new FakeVehicleItemsRepository();
    fakeStorageProvider = new FakeStorageProvider();

    createCarImages = new UploadCarImagesService(
      fakeCarsImagesRepository,
      fakeCarsRepository,
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to upload a new image to the car', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_legal: true,
      is_active: false,
    });

    const vehicleItems = await fakeVehicleItemsRepository.create({
      air_conditioning: true,
      airbag: true,
      alarm: true,
      armoured: true,
      eletric_lock: true,
      eletric_window: true,
      hydraulic_steering: true,
      reverse_camera: false,
      reverse_sensor: false,
      stereo: true,
    });

    const car = await fakeCarsRepository.create({
      manufacturer: 'General Motors',
      brand: 'Chevrolet',
      model: 'Onix',
      year_manufacture: '2021',
      year_model: '2022',
      vehicle_item_id: vehicleItems.id,
    });

    const carImage = await createCarImages.execute({
      user_id: user.id,
      car_id: car.id,
      imageCarFilename: 'image.jpg',
    });

    expect(carImage.image).toBe('image.jpg');
  });

  it('should not be able to upload image from non-existent car', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      nickname: 'john.doe',
      password: '123456',
      email: 'johndoe@example.com',
      phone: '12987906565',
      document: '22287634090',
      cnpj: '42800967000134',
      is_legal: true,
      is_active: false,
    });

    expect(
      createCarImages.execute({
        user_id: user.id,
        car_id: 'non-existent car',
        imageCarFilename: 'image.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upload image from non-existent user', async () => {
    const vehicleItems = await fakeVehicleItemsRepository.create({
      air_conditioning: true,
      airbag: true,
      alarm: true,
      armoured: true,
      eletric_lock: true,
      eletric_window: true,
      hydraulic_steering: true,
      reverse_camera: false,
      reverse_sensor: false,
      stereo: true,
    });

    const car = await fakeCarsRepository.create({
      manufacturer: 'General Motors',
      brand: 'Chevrolet',
      model: 'Onix',
      year_manufacture: '2021',
      year_model: '2022',
      vehicle_item_id: vehicleItems.id,
    });

    expect(
      createCarImages.execute({
        user_id: 'non-existent user',
        car_id: car.id,
        imageCarFilename: 'image.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
