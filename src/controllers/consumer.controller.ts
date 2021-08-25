import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import moment from 'moment';
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
      '409': {
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
    consumer: Omit<Consumers, 'id'>,
  ): Promise<Consumers> {
    const consumerDetails = await this.consumersRepository.findOne({
      where: {
        nationalId: consumer.nationalId,
      },
      include: [
        {
          relation: 'bookings',
        },
      ],
    });

    if (
      consumerDetails &&
      moment(consumer.birthday).isSame(consumerDetails.birthday)
    ) {
      return consumerDetails;
    } else if (consumerDetails) {
      throw Object.assign(new HttpErrors.Conflict(`Id already exits`), {
        code: `CONSUMER_IDENTITY_EXITS`,
      });
    }

    return this.consumersRepository.create(consumer);
  }

  @get('/consumers/{nationalId}', {
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
  async findById(
    @param.path.string('nationalId') nationalId: string,
  ): Promise<Consumers> {
    const consumer = await this.consumersRepository.findOne({
      where: {
        nationalId: nationalId,
      },
      include: [
        {
          relation: 'bookings',
          scope: {
            include: [
              {
                relation: 'centre',
              },
              {
                relation: 'slot',
              },
            ],
          },
        },
      ],
    });

    if (!consumer) {
      throw new HttpErrors.NotFound(`Consumer not found.`);
    }

    return consumer;
  }
}
