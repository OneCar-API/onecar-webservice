import { injectable } from 'tsyringe';
import cep from 'cep-promise';

import api from '@shared/infra/http/apiHere';
import { IImportAddress } from '@modules/users/services/ImportUsersService';
import IMapProvider from '../models/IMapProvider';

@injectable()
export default class HEREMapProvider implements IMapProvider {
  public async formatAddress({
    neighborhood,
    city,
    state,
    zip_code,
  }: IImportAddress): Promise<IImportAddress | null> {
    const paramsAddress = await cep(zip_code)
      .then(
        (address: IImportAddress) =>
          `${address.neighborhood}, ${address.city} - ${address.state}`,
      )
      .catch(() => null);

    if (!paramsAddress) {
      return null;
    }

    try {
      const response = await api.get('/geocode', {
        params: {
          q: paramsAddress,
        },
      });

      const { data } = response;

      if (data.items.length === 0) {
        return null;
      }

      const addressFormatted = {
        neighborhood,
        city,
        state,
        zip_code,
      };

      return addressFormatted;
    } catch (error) {
      return null;
    }
  }
}
