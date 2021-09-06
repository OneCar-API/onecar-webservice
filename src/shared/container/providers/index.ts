import { container } from 'tsyringe';

import IMapProvider from './MapProvider/models/IMapProvider';
import HEREMapProvider from './MapProvider/implementations/HEREMapProvider';

container.registerSingleton<IMapProvider>('MapProvider', HEREMapProvider);
