import {Client} from '@loopback/testlab';
import moment from 'moment';
import {VaccinationApp} from '../..';
import {Consumers} from '../../models';
import {ConsumersRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('ConsumerController', () => {
  let app: VaccinationApp;
  let client: Client;
  let consumersRepository: ConsumersRepository;
  let consumer: Partial<Consumers>;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    consumersRepository = await app.getRepository(ConsumersRepository);
    consumer = {
      nationalId: 'ABC123',
      name: 'Tony Stark',
      birthday: moment().utc().subtract(12, 'y').format('YYYY-MM-DD'),
    };
  });

  afterEach(async () => {
    await consumersRepository.deleteAll();
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /consumers', () => {
    it('should return consumer if it exits with same dob and national id', async () => {
      await consumersRepository.create(consumer);

      await client.post('/consumers').send(consumer).expect(200);
    });

    it('should be able to create new consumer if not exist already', async () => {
      await client.post('/consumers').send(consumer).expect(200);
    });
  });

  describe('GET /consumers/{nationalId}', () => {
    it('should get consumer by nationalId', async () => {
      const consumerWithId = await consumersRepository.create(consumer);

      await client.get(`/consumers/${consumerWithId.nationalId}`).expect(200);
    });
  });
});
