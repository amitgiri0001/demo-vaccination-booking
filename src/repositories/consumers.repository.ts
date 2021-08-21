import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {VaccinationDbDataSource} from '../datasources';
import {Consumers, ConsumersRelations, Bookings} from '../models';
import {BookingsRepository} from './bookings.repository';

export class ConsumersRepository extends DefaultCrudRepository<
  Consumers,
  typeof Consumers.prototype.id,
  ConsumersRelations
> {
  public readonly bookings: HasManyRepositoryFactory<
    Bookings,
    typeof Consumers.prototype.id
  >;

  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
    @repository.getter('BookingsRepository')
    protected bookingsRepositoryGetter: Getter<BookingsRepository>,
  ) {
    super(Consumers, dataSource);
    this.bookings = this.createHasManyRepositoryFactoryFor(
      'bookings',
      bookingsRepositoryGetter,
    );
    this.registerInclusionResolver('bookings', this.bookings.inclusionResolver);
  }
}
