import {inject} from '@loopback/core';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import moment from 'moment';
import {Slots} from '../models';
import {BookingService} from '../services/booking.service';

export class CentreController {
  constructor(
    @inject(BookingService.BINDING_NAME)
    private bookingService: BookingService,
  ) {}

  @get('/centres/{centreId}/slots')
  @response(200, {
    description: 'Array of Centres model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Slots, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.number('centreId')
    centreId: number,
    @param.query.dateTime('date')
    date: Date,
  ): Promise<unknown> {
    return this.bookingService.getSlotsByCentre(
      centreId,
      moment(date).toDate(),
    );
  }
}
