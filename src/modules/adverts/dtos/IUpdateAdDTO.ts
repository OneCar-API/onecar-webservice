export default interface IUpdateAdDTO {
  ad_id: string;
  title?: string;
  description?: string;
  manufacturer?: string;
  brand?: string;
  model?: string;
  year_manufacture?: string;
  year_model?: string;
  fuel?: string;
  gearbox_type?: string;
  km?: Number;
  color?: string;
  vehicle_price?: string;
}
