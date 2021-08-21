import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VaccinationDbDataSource} from '../datasources';
import {Centres, CentresRelations} from '../models';

export class CentresRepository extends DefaultCrudRepository<
  Centres,
  typeof Centres.prototype.id,
  CentresRelations
> {
  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
  ) {
    super(Centres, dataSource);
  }
}
