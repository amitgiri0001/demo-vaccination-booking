import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VaccinationDbDataSource} from '../datasources';
import {StaffSchedules, StaffSchedulesRelations} from '../models';

export class StaffSchedulesRepository extends DefaultCrudRepository<
  StaffSchedules,
  typeof StaffSchedules.prototype.id,
  StaffSchedulesRelations
> {
  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
  ) {
    super(StaffSchedules, dataSource);
  }
}
