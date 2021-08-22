import {expect} from '@loopback/testlab';
import moment from 'moment';
import {VaccinationApp} from '../..';
import {StaffSchedulesRepository} from '../../repositories';
import {BookingService} from '../../services';
import {setupApplication} from '../acceptance/test-helper';

describe('Name of the group', () => {
  let app: VaccinationApp;
  let bookingService: BookingService;

  before('setupApplication', async () => {
    ({app} = await setupApplication());
    bookingService = await app.get(BookingService.BINDING_NAME);
  });

  after(async () => {
    await app.stop();
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
});
