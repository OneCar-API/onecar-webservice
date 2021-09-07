import ICreateAddressDTO from '../dtos/ICreateAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IAddressesRepository {
  create({
    user_id,
    zip_code,
    neighborhood,
    city,
    state,
  }: ICreateAddressDTO): Promise<Address>;
}
