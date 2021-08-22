import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Consumers} from '../models';
import {ConsumersRepository} from '../repositories';

export class ConsumerController {
  constructor(
    @repository(ConsumersRepository)
    public consumersRepository: ConsumersRepository,
  ) {}

  @post('/consumers')
  @response(200, {
    description: 'Consumers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Consumers, {includeRelations: true}),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consumers, {
            title: 'NewConsumers',
            exclude: ['createdAt', 'updatedAt', 'deletedAt', 'id'],
          }),
        },
      },
    })
    consumers: Omit<Consumers, 'id'>,
  ): Promise<Consumers> {
    const isExistingConsumer = await this.consumersRepository.findOne({
      where: {
        nationalId: consumers.nationalId,
      },
      include: [
        {
          relation: 'bookings',
        },
      ],
    });

    if (isExistingConsumer) {
      throw Object.assign(
        new HttpErrors.BadRequest(`Identity already exits.`),
        {
          code: 'CONSUMER_IDENTITY_EXITS',
        },
      );
    }

    return this.consumersRepository.create(consumers);
  }

  @get('/consumers/{id}')
  @response(200, {
    description: 'Consumers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Consumers, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.number('id') id: number): Promise<Consumers> {
    return this.consumersRepository.findById(id, {
      include: [
        {
          relation: 'bookings',
        },
      ],
    });
  }
}
