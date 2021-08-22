import {Client} from '@loopback/testlab';
import {VaccinationApp} from '../..';
import {Consumers} from '../../models';
import {ConsumersRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('ConsumerController', () => {
  let app: VaccinationApp;
  let client: Client;
  let consumersRepository: ConsumersRepository
  let consumer: Partial<Consumers>;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    consumersRepository = await (app.getRepository(ConsumersRepository));
    consumer = {
      nationalId: 'ABC123',
      name: 'Tony Stark'
    };
  });

  afterEach(async () => {
    await consumersRepository.deleteAll();
  })

  after(async () => {
    await app.stop();
  });

  describe('POST /consumers', () => {
    it('should check for consumer existence to avoid duplication', async () => {
      await consumersRepository.create(consumer);

      await client
      .post('/consumers')
      .send(consumer)
      .expect(400);
    });

    it('should be able to create new consumer if not exist already', async () => {
      await client
      .post('/consumers')
      .send(consumer)
      .expect(200);
    });
  });

  describe('GET /consumers/{id}', () => {
    it('should get consumer by id', async () => {
      const consumerWithId = await consumersRepository.create(consumer);

      await client
      .get(`/consumers/${consumerWithId.id}`)
      .expect(200);
    });
  });
});
