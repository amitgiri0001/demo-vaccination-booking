import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import moment from 'moment-timezone';
import {VaccinationDbDataSource} from '../datasources';
import {Bookings, BookingsRelations} from '../models';

export class BookingsRepository extends DefaultCrudRepository<
  Bookings,
  typeof Bookings.prototype.id,
  BookingsRelations
> {
  constructor(
    @inject('datasources.vaccination_db') dataSource: VaccinationDbDataSource,
  ) {
    super(Bookings, dataSource);
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
