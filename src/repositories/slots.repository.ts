import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {VaccinationDbDataSource} from '../datasources';
import {Slots, SlotsRelations} from '../models';

export class SlotsRepository extends DefaultCrudRepository<
  Slots,
  typeof Slots.prototype.id,
  SlotsRelations
> {
  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
  ) {
    super(Slots, dataSource);
  }
}
