import { createConnection, getConnectionOptions } from 'typeorm';
interface IOptions {
  host: string;
}
/*
getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = 'database_onecar';
  createConnection({
    ...options,
  }).catch(err => {
    console.log(err)
  })
});*/

(async () => {
  createConnection()
    .then(() => {
      console.log('Connection with database performed');
    })
    .catch(err => {
      console.log('Error during connecting to database', err);
    });
})();
