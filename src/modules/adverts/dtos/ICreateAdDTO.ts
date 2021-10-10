import Car from "../infra/typeorm/entities/Car";
import User from "../../users/infra/typeorm/entities/User"


export default interface ICreateAdDTO {
  ad_code?: string;
  vehicle_price?: string;
  title?: string;
  description?: string;
  user_id?: User;
  car_id: string;
}
