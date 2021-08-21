import {inject} from '@loopback/core';
import {
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {Bookings} from '../models';
import {BookingService} from '../services';

export class BookingController {
  constructor(
    @inject(BookingService.BINDING_NAME)
    private bookingService: BookingService,
  ) {}

  @post('/bookings')
  @response(200, {
    description: 'Bookings model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bookings)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bookings, {
            title: 'NewBookings',
            exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt'],
          }),
        },
      },
    })
    booking: Omit<Bookings, 'id'>,
  ): Promise<Bookings> {
    try {
      return await this.bookingService.createBooking(booking);
    } catch (error) {
      if (error.code) {
        throw Object.assign(new HttpErrors.BadRequest(), {
          code: error.code,
        });
      } else {
        throw error;
      }
    }
  }
}
