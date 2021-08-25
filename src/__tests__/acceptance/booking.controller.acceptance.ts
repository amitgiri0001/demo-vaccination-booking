import {Client, expect} from '@loopback/testlab';
import moment from 'moment';
import sinon from 'sinon';
import {VaccinationApp} from '../..';
import {BookingsRepository} from '../../repositories';
import {BookingService} from '../../services';
import {setupApplication} from './test-helper';

describe('BookingController', () => {
  let app: VaccinationApp;
  let client: Client;
  let bookingsRepository: BookingsRepository;
  let createBookingStub: sinon.SinonStub;

  before('setupApplication', async () => {
    createBookingStub = sinon.stub(BookingService.prototype, 'createBooking');
    ({app, client} = await setupApplication());
    bookingsRepository = await app.getRepository(BookingsRepository);
  });

  afterEach(async () => {
    await bookingsRepository.deleteAll();
  });

  after(async () => {
    createBookingStub.restore();
    await app.stop();
  });

  describe('POST /bookings', () => {
    it('should be able to create bookings with details', async () => {
      const bookingDetails = {
        centreId: 1,
        slotId: 1,
        consumerId: 1,
        bookingDate: moment().utc().format(),
        status: 'booked',
      };

      createBookingStub.resolves({id: 1, ...bookingDetails});

      await client.post(`/bookings`).send(bookingDetails).expect(200);
    });

    it('should be able to properly handle slot full error', async () => {
      const bookingDetails = {
        centreId: 1,
        slotId: 1,
        consumerId: 1,
        bookingDate: moment().utc().format(),
        status: 'booked',
      };

      createBookingStub.throws({
        code: 'ALREADY_BOOKED',
      });

      await client
        .post(`/bookings`)
        .send(bookingDetails)
        .expect(400)
        .catch(error => {
          expect(error.code).eql('ALREADY_BOOKED');
        });
    });
  });

  describe('DEL /bookings/{id}', () => {
    it('should be able to delete bookings by id', async () => {
      const bookingDetails = await bookingsRepository.create({
        centreId: 1,
        slotId: 1,
        consumerId: 1,
        bookingDate: moment().utc().format(),
        status: 'booked',
      });

      await client.del(`/bookings/${bookingDetails.id}`).expect(204);
    });
  });
});
