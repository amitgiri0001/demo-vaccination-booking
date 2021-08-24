import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'vaccination_db',
  connector: 'postgresql',
  url: 'postgres://nvjewjimuwgple:ff7278b7f2182ee7ece57728446d060992c66e3eab7e090fa348fdab06b9c09a@ec2-44-194-112-166.compute-1.amazonaws.com:5432/d16ha6rnoe5383',
  host: 'ec2-44-194-112-166.compute-1.amazonaws.com',
  port: 5432,
  user: 'nvjewjimuwgple',
  password: 'ff7278b7f2182ee7ece57728446d060992c66e3eab7e090fa348fdab06b9c09a',
  database: 'd16ha6rnoe5383',
  ssl: {
    rejectUnauthorized: false,
  },
};

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
