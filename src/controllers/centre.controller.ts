import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import moment from 'moment';
import {Centres, Slots} from '../models';
import {CentresRepository} from '../repositories';
import {BookingService} from '../services/booking.service';

export class CentreController {
  constructor(
    @inject(BookingService.BINDING_NAME)
    private bookingService: BookingService,
    @repository(CentresRepository)
    private centresRepository: CentresRepository,
  ) {}

  @get('/centres/{centreId}/slots', {
    tags: ['Centre'],
    responses: {
      '200': {
        description: 'Array of Centres model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Slots, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('centreId')
    centreId: number,
    @param.query.date('date')
    date: Date,
  ): Promise<unknown> {
    return this.bookingService.getSlotsByCentre(
      centreId,
      moment(date).toDate(),
    );
  }

  @get('/centres', {
    tags: ['Centre'],
    responses: {
      '200': {
        description: 'Array of Centres model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Centres, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async listCentres(): Promise<unknown> {
    return this.centresRepository.find();
  }
}
