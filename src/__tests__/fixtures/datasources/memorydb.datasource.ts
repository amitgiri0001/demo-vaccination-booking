import {VaccinationDbDataSource} from '../../../datasources/vaccination-db.datasource';

export class Memorydb extends VaccinationDbDataSource {
  constructor() {
    super({
      name: 'test_in_memory_db',
      connector: 'memory',
      url: '',
      host: '',
      port: '',
      user: '',
      password: '',
      database: '',
      debug: '',
      ssl: false,
    });
  }
}
