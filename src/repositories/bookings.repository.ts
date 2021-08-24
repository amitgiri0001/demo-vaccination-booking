import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import moment from 'moment-timezone';
import {VaccinationDbDataSource} from '../datasources';
import {
  Bookings,
  BookingsRelations,
  Centres,
  Consumers,
  Slots,
} from '../models';
import {CentresRepository} from './centres.repository';
import {ConsumersRepository} from './consumers.repository';
import {SlotsRepository} from './slots.repository';

export class BookingsRepository extends DefaultCrudRepository<
  Bookings,
  typeof Bookings.prototype.id,
  BookingsRelations
> {
  public readonly centre: BelongsToAccessor<
    Centres,
    typeof Bookings.prototype.id
  >;

  public readonly consumer: BelongsToAccessor<
    Consumers,
    typeof Bookings.prototype.id
  >;

  public readonly slot: BelongsToAccessor<Slots, typeof Bookings.prototype.id>;

  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
    @repository.getter('CentresRepository')
    protected centresRepositoryGetter: Getter<CentresRepository>,
    @repository.getter('ConsumersRepository')
    protected consumersRepositoryGetter: Getter<ConsumersRepository>,
    @repository.getter('SlotsRepository')
    protected slotsRepositoryGetter: Getter<SlotsRepository>,
  ) {
    super(Bookings, dataSource);
    this.slot = this.createBelongsToAccessorFor('slot', slotsRepositoryGetter);
    this.registerInclusionResolver('slot', this.slot.inclusionResolver);
    this.consumer = this.createBelongsToAccessorFor(
      'consumer',
      consumersRepositoryGetter,
    );
    this.registerInclusionResolver('consumer', this.consumer.inclusionResolver);
    this.centre = this.createBelongsToAccessorFor(
      'centre',
      centresRepositoryGetter,
    );
    this.registerInclusionResolver('centre', this.centre.inclusionResolver);
  }

  async getOccupiedSlots(
    centreId: number,
    maxSlotsByCentre: number,
    onDate: Date,
    transaction = {},
  ): Promise<number[]> {
    const bookingDate = moment(onDate).utc().format('YYYY-MM-DD hh:mm:ssZ');
    const bookingSlots = (await this.execute(
      `
      select slot_id from bookings
        where
          booking_date = $3
          and centre_id = $1
        group by slot_id
          having count(slot_id) > $2
    `,
      [centreId, maxSlotsByCentre, bookingDate],
      transaction,
      // eslint-disable-next-line @typescript-eslint/naming-convention
    )) as {slot_id: number}[];

    return bookingSlots.map(booking => booking.slot_id);
  }
}
