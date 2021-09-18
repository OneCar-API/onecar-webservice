import ICreateVehicleItemsDTO from '../dtos/ICreateVehicleItemsDTO';
import VehicleItem from '../infra/typeorm/entities/VehicleItem';

export default interface IVehicleItemsRepository {
  import({
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
  }: ICreateVehicleItemsDTO)
  save({
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
  }: VehicleItem): Promise<VehicleItem>}
