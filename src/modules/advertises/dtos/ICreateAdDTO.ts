import Car from "../infra/typeorm/entities/Car";


export default interface ICreateAdDTO {
  ad_code?: string;
  vehicle_price?: string;
  user_id?: string;
  car_id: Car;
}
