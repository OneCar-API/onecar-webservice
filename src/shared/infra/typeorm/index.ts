import { createConnections, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  const mongoOptions = options as IOptions;
  newOptions.host = 'database_onecar';
  //mongoOptions.host = 'mongo_onecar';
  createConnections([{
    ...options,
  }]);
});
