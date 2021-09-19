import ICreateVehicleItemsDTO from '../dtos/ICreateVehicleItemsDTO';
import VehicleItem from '../../adverts/infra/typeorm/entities/VehicleItem';

export default interface IVehicleItemsRepository {
  create({
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
  }: ICreateVehicleItemsDTO): Promise<VehicleItem>;
  save(vehicleItem: VehicleItem): Promise<VehicleItem>;
  findById(id: string): Promise<VehicleItem | undefined>;
  findAll(): Promise<VehicleItem[]>;
}
