import {inject} from '@loopback/core';
import {getModelSchemaRef, HttpErrors, post, requestBody} from '@loopback/rest';
import {Bookings} from '../models';
import {BookingService} from '../services';

export class BookingController {
  constructor(
    @inject(BookingService.BINDING_NAME)
    private bookingService: BookingService,
  ) {}

  @post('/bookings', {
    tags: ['Bookings'],
    responses: {
      '200': {
        description: 'Bookings model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bookings)}},
      },
      '409': {
        description: 'The slot got full before the request.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  enum: ['SLOT_FULL'],
                },
              },
            },
          },
        },
      },
      '400': {
        description: 'Consumer already has a booking.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  enum: ['ALREADY_BOOKED'],
                },
              },
            },
          },
        },
      },
    },
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
