import {expect} from '@loopback/testlab';
import moment from 'moment';
import sinon from 'sinon';
import {VaccinationApp} from '../..';
import {
  BookingsRepository,
  SlotsRepository,
  StaffSchedulesRepository,
} from '../../repositories';
import {BookingService} from '../../services';
import {setupApplication} from '../acceptance/test-helper';

describe('BookingService', () => {
  let app: VaccinationApp;
  let bookingService: BookingService;
  const sinonSandbox = sinon.createSandbox();
  let getOccupiedSlots: sinon.SinonStub;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
    bookingService = await app.get(BookingService.BINDING_NAME);
    getOccupiedSlots = sinonSandbox.stub(
      BookingsRepository.prototype,
      'getOccupiedSlots',
    );
  });

  after(async () => {
    await app.stop();
    sinonSandbox.restore();
  });

  describe('getCenterCapacityPerSlot', () => {
    it('should be able to get staff per slot', async () => {
      await (
        await app.getRepository(StaffSchedulesRepository)
      ).create({
        centreId: 1,
        staffId: 1,
        assignmentStartAt: moment().utc().format(),
        assignmentEndAt: moment().add(1, 'month').utc().format(),
      });

      const centerCapacityPerSlot =
        await bookingService.getCenterCapacityPerSlot(
          1,
          moment().add(1, 'day').utc().toDate(),
        );

      expect(centerCapacityPerSlot).eql(
        1 * BookingService.STAFF_CAPACITY_BY_SLOT_SIZE,
      );
    });
  });

  describe('getSlotsByCentre', () => {
    it('should be able to get staff per slot', async () => {
      getOccupiedSlots.resolves([1]);

      await (
        await app.getRepository(StaffSchedulesRepository)
      ).create({
        centreId: 1,
        staffId: 1,
        assignmentStartAt: moment().utc().format(),
        assignmentEndAt: moment().add(1, 'month').utc().format(),
      });

      await (
        await app.getRepository(SlotsRepository)
      ).create({
        id: 1,
        startAt: '08:00:00',
        endAt: '08:30:00',
        createdAt: moment().format(),
        updatedAt: moment().format(),
      });

      await (
        await app.getRepository(SlotsRepository)
      ).create({
        id: 2,
        startAt: '08:30:00',
        endAt: '09:00:00',
        createdAt: moment().format(),
        updatedAt: moment().format(),
      });

      const availableSlots = await bookingService.getSlotsByCentre(
        1,
        moment().add(1, 'day').utc().toDate(),
      );

      expect(availableSlots.length).eql(2);
      sinonSandbox.restore();
    });
  });

  describe('createBooking', () => {
    beforeEach(async () => {
      await (await app.getRepository(BookingsRepository)).deleteAll();
    });

    it('should reject booking if already booking already exits', async () => {
      const bookingObj = {
        slotId: 1,
        centreId: 1,
        consumerId: 1,
        bookingDate: moment().utc().format(),
        status: 'booked',
      };

      await (await app.getRepository(BookingsRepository)).create(bookingObj);

      const bookingInDB = await bookingService
        .createBooking(bookingObj)
        .catch(error => {
          expect(error.code).eql('ALREADY_BOOKED');
        });

      expect(bookingInDB).undefined();
    });

    it('should reject while booking if the slot is full because of concurrency', async () => {
      const bookingObj = {
        slotId: 1,
        centreId: 1,
        consumerId: 1,
        bookingDate: moment().utc().format(),
        status: 'booked',
      };

      await (await app.getRepository(BookingsRepository)).create(bookingObj);

      bookingObj.consumerId = 2;

      const bookingInDB = await bookingService
        .createBooking(bookingObj)
        .catch(error => {
          expect(error.code).eql('SLOT_FULL');
        });

      expect(bookingInDB).undefined();
    });

    it('should be able to create booking with all conditions satisfied', async () => {
      await (
        await app.getRepository(StaffSchedulesRepository)
      ).create({
        centreId: 1,
        staffId: 2,
        assignmentStartAt: moment().utc().format(),
        assignmentEndAt: moment().add(1, 'month').utc().format(),
      });

      const bookingObj = {
        slotId: 2,
        centreId: 1,
        consumerId: 1,
        bookingDate: moment().add(1, 'day').utc().toDate(),
        status: 'booked',
      };

      const bookingInDB = await bookingService.createBooking(bookingObj);

      expect(bookingInDB.id).not.undefined();
    });
  });
});
