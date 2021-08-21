import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VaccinationDbDataSource} from '../datasources';
import {Staff, StaffRelations} from '../models';

export class StaffRepository extends DefaultCrudRepository<
  Staff,
  typeof Staff.prototype.id,
  StaffRelations
> {
  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
  ) {
    super(Staff, dataSource);
  }
}
