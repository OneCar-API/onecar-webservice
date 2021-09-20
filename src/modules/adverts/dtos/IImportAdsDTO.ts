import User from "@modules/users/infra/typeorm/entities/User";

export default interface IImportAdsDTO {
  ad_code?: string;
  manufacturer?: string;
  brand?: string;
  model?: string;
  year_manufacture?: string;
  year_model?: string;
  document?: string;
  cnpj?: string;
  price?: string;
  user_id?: User;
}
