import { getRepository, Repository } from 'typeorm';

import IVehicleItemsRepository from '@modules/ads/repositories/IVehicleItemsRepository';
import ICreateVehicleItemsDTO from '@modules/ads/dtos/ICreateVehicleItemsDTO';
import VehicleItem from '../entities/VehicleItem';

class VehicleItemRepository implements IVehicleItemsRepository {
  private ormRepository: Repository<VehicleItem>;

  constructor() {
    this.ormRepository = getRepository(VehicleItem);
  }

  public async import({
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

  public async agreeToSubscribeData(confirm_import: boolean): Promise<boolean> {
    const contactQuery = this.ormRepository.createQueryBuilder();

    if (confirm_import) {
      contactQuery.andWhere('confirm_import = :confirm_import', {
        confirm_import: true,
      });
    }

    return confirm_import;
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

export default VehicleItemRepository;
