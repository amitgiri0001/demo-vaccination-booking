import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Bookings, BookingsWithRelations} from '../models';
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

  @get('/bookings/{consumerId}', {
    tags: ['Bookings'],
    responses: {
      '200': {
        description: 'Bookings model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Bookings, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('consumerId') consumerId: number,
  ): Promise<BookingsWithRelations[]> {
    return this.bookingsRepository.find({
      where: {
        consumerId: consumerId,
      },
      include: [
        {
          relation: 'centre',
        },
        {
          relation: 'consumer',
        },
        {
          relation: 'slot',
        },
      ],
    });
  }
}
