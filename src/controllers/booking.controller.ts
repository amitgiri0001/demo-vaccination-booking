import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import moment from 'moment';
import {Bookings} from '../models';
import {BookingsRepository} from '../repositories';
import {BookingService} from '../services';

export class BookingController {
  constructor(
    @inject(BookingService.BINDING_NAME)
    private bookingService: BookingService,
    @repository(BookingsRepository)
    private bookingsRepository: BookingsRepository,
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

  @del('/bookings/{id}', {
    tags: ['Bookings'],
    responses: {
      '204': {
        description: 'Booking DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    return this.bookingsRepository.updateById(id, {
      deletedAt: moment().utc().format(),
    });
  }
}
