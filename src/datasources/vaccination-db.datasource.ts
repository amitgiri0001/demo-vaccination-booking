import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

let config = {
  name: 'vaccination_db',
  connector: 'postgresql',
  host: '',
  port: 5432,
  user: '',
  password: '',
  database: '',
  url: '',
  ssl: {
    rejectUnauthorized: false,
  },
};

let dbConfig;
if (process.env.NODE_ENV === 'local') {
  dbConfig = require('../../dbConfig.json');
  config = {...config, ...dbConfig};
} else {
  config.host = process.env.HOST as string;
  config.user = process.env.USER as string;
  config.password = process.env.PASSWORD as string;
  config.database = process.env.DATABASE as string;
  config.url = process.env.URI as string;
}

console.log("config ***************************",config);


// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class VaccinationDbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'vaccination_db';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.vaccination_db', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
