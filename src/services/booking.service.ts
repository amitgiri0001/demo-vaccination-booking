import {bind, BindingKey, BindingScope} from '@loopback/core';
import {IsolationLevel, repository} from '@loopback/repository';
import moment from 'moment-timezone';
import {Bookings} from '../models';
import {
  BookingsRepository,
  SlotsRepository,
  StaffSchedulesRepository,
} from '../repositories';

@bind({
  scope: BindingScope.TRANSIENT,
  tags: ['service', {key: BookingService.BINDING_NAME}],
})
export class BookingService {
  static BINDING_NAME = BindingKey.create<BookingService>(
    `service.BookingService`,
  );

  static SLOT_SIZE = 30; // minutes
  static VACCINATION_INTERVAL = 30; // minutes
  static STAFF_CAPACITY_BY_SLOT_SIZE =
    BookingService.SLOT_SIZE / BookingService.VACCINATION_INTERVAL;

  constructor(
    @repository(StaffSchedulesRepository)
    private staffSchedulesRepository: StaffSchedulesRepository,
    @repository(SlotsRepository)
    private slotsRepository: SlotsRepository,
    @repository(BookingsRepository)
    private bookingsRepository: BookingsRepository,
  ) {}

  async getCenterCapacityPerSlot(centreId: number, onDate: Date) {
    const availableNumberOfStaff = await this.staffSchedulesRepository.find({
      where: {
        centreId: centreId,
        assignmentStartAt: {
          lte: moment(onDate).utc().format('YYYY-MM-DD hh:mm:ssZ'),
        },
        assignmentEndAt: {
          gt: moment(onDate).utc().format('YYYY-MM-DD hh:mm:ssZ'),
        },
      },
    });

    const centerCapacityPerSlot =
      availableNumberOfStaff.length *
      BookingService.STAFF_CAPACITY_BY_SLOT_SIZE;

    return centerCapacityPerSlot;
  }

  async getSlotsByCentre(centreId: number, onDate: Date) {
    // get center capacity per slot on a given day
    const centerCapacityPerSlot = await this.getCenterCapacityPerSlot(
      centreId,
      onDate,
    );

    // get already occupied slots on give day by slot size
    const occupiedSlots = await this.bookingsRepository.getOccupiedSlots(
      centreId,
      centerCapacityPerSlot,
      onDate,
    );

    // map slots to disable on FE and return
    const allSlots = await this.slotsRepository.find();

    return allSlots.map(slot => {
      if (occupiedSlots.includes(slot.id)) {
        slot.isBooked = true;
      } else {
        slot.isBooked = false;
      }

      return slot;
    });
  }

  async createBooking(booking: Omit<Bookings, 'id'>) {
    booking.bookingDate = moment(booking.bookingDate).utc().format();

    const centerCapacityPerSlot = await this.getCenterCapacityPerSlot(
      booking.centreId,
      booking.bookingDate,
    );

    const transaction =
      await this.bookingsRepository.dataSource.beginTransaction({
        isolationLevel: IsolationLevel.SERIALIZABLE,
        timeout: 10000,
      });

    // Check for existing booking by consumerId
    const isAlreadyBooked = await this.bookingsRepository.findOne(
      {
        where: {
          consumerId: booking.consumerId,
          status: 'booked',
        },
      },
      transaction,
    );

    if (isAlreadyBooked) {
      await transaction.rollback();
      throw Object.assign({
        code: 'ALREADY_BOOKED',
      });
    }

    // check available slot
    const allSlotIds = await this.bookingsRepository.getOccupiedSlots(
      booking.centreId,
      centerCapacityPerSlot,
      booking.bookingDate,
      transaction,
    );
    if (allSlotIds.includes(booking.slotId)) {
      await transaction.rollback();
      throw Object.assign({
        code: 'SLOT_FULL',
      });
    }

    // check create booking.
    const bookingDetails = await this.bookingsRepository.create(
      booking,
      transaction,
    );

    await transaction.commit();

    return bookingDetails;
  }
}
