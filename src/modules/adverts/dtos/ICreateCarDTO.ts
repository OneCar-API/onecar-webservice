import VehicleItem from "../infra/typeorm/entities/VehicleItem";

export default interface ICreateCarDTO {
  manufacturer?: string;
  brand?: string;
  model?: string;
  year_manufacture?: string;
  year_model?: string;
  vehicle_item_id?: VehicleItem;
}
