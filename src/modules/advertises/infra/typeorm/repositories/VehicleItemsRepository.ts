import 'reflect-metadata';

import { getRepository, Repository } from 'typeorm';

import IVehicleItemsRepository from '@modules/advertises/repositories/IVehicleItemsRepository';
import ICreateVehicleItemsDTO from '@modules/advertises/dtos/ICreateVehicleItemsDTO';
import VehicleItem from '../../../../advertises/infra/typeorm/entities/VehicleItem';

class VehicleItemsRepository implements IVehicleItemsRepository {
  private ormRepository: Repository<VehicleItem>;

  constructor() {
    this.ormRepository = getRepository(VehicleItem);
  }

  public async create({
    airbag,
    alarm,
    air_conditioning,
    eletric_lock,
    eletric_window,
    stereo,
    reverse_sensor,
    reverse_camera,
    armoured,
    hydraulic_steering,
  }: ICreateVehicleItemsDTO): Promise<VehicleItem> {
    const vehicleItem = this.ormRepository.create({
      airbag,
      alarm,
      air_conditioning,
      eletric_lock,
      eletric_window,
      stereo,
      reverse_sensor,
      reverse_camera,
      armoured,
      hydraulic_steering,
    });
    await this.ormRepository.save(vehicleItem);

    return vehicleItem;
  }

  public async save(vehicleItem: VehicleItem): Promise<VehicleItem> {
    return this.ormRepository.save(vehicleItem);
  }

  public async findById(id: string): Promise<VehicleItem | undefined> {
    const vehicleItem = this.ormRepository.findOne(id);

    return vehicleItem;
  }

  public async findAll(): Promise<VehicleItem[]> {
    const vehicleItems = await this.ormRepository.find();

    return vehicleItems;
  }
}

export default VehicleItemsRepository;
