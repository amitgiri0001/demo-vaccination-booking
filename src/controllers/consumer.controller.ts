import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Consumers} from '../models';
import {ConsumersRepository} from '../repositories';

export class ConsumerController {
  constructor(
    @repository(ConsumersRepository)
    public consumersRepository: ConsumersRepository,
  ) {}

  @post('/consumers', {
    tags: ['Consumer'],
    responses: {
      '200': {
        description: 'Consumers model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Consumers, {includeRelations: true}),
          },
        },
      },
      '400': {
        description: 'Consumer identity already exits.',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  enum: ['CONSUMER_IDENTITY_EXITS'],
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

  @get('/consumers/{id}', {
    tags: ['Consumer'],
    responses: {
      '200': {
        description: 'Consumers model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Consumers, {includeRelations: true}),
          },
        },
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
