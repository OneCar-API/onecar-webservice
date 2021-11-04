import { createConnections, getConnectionOptions } from 'typeorm';
interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = 'database_onecar';
  createConnections([{
    ...options,

  }]).catch(err => {
    console.log(err)
  })
});
