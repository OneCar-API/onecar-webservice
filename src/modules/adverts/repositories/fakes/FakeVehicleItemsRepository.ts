import { v4 as uuidV4 } from 'uuid';

import ICreateVehicleItemsDTO from '@modules/cars/dtos/ICreateVehicleItemsDTO';
import IVehicleItemsRepository from '../IVehicleItemsRepository';

import VehicleItem from '../../infra/typeorm/entities/VehicleItem';
import Ad from '@modules/adverts/infra/typeorm/entities/Ad';

class FakeVehicleItemsRepository
  implements IVehicleItemsRepository {
  private vehicleItems: VehicleItem[] = [];

  public async create({
    air_conditioning,
    airbag,
    alarm,
    armoured,
    eletric_lock,
    eletric_window,
    hydraulic_steering,
    reverse_camera,
    reverse_sensor,
    stereo,
  }: ICreateVehicleItemsDTO): Promise<VehicleItem> {
    const vehicleItem = new VehicleItem();

    Object.assign(vehicleItem, {
      id: uuidV4(),
      air_conditioning,
      airbag,
      alarm,
      armoured,
      eletric_lock,
      eletric_window,
      hydraulic_steering,
      reverse_camera,
      reverse_sensor,
      stereo,
    });

    this.vehicleItems.push(vehicleItem);

    return vehicleItem;
  }

  public async save(vehicleItem: VehicleItem): Promise<VehicleItem> {
    const findIndex = this.vehicleItems.findIndex(findVehicleItem => findVehicleItem.id === vehicleItem.id);

    this.vehicleItems[findIndex] = vehicleItem;

    return vehicleItem;
  }

  public async findById(id: string): Promise<VehicleItem | undefined> {
    const findVehicleItem = this.vehicleItems.find(vehicleItem => vehicleItem.id === id);

    return findVehicleItem;
  }

  public async findAll(): Promise<VehicleItem[]> {
    const findVehicleItems = this.vehicleItems.filter(vehicleItem => vehicleItem);

    return findVehicleItems;
  }
}

export default FakeVehicleItemsRepository;
