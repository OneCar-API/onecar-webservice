import { IAddress } from '@modules/users/services/ImportUsersService';

export default interface IMapProvider {
  formatAddress(address: IAddress): Promise<IAddress | null>;
}
