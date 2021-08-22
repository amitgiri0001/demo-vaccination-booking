import {Client} from '@loopback/testlab';
import {VaccinationApp} from '../..';
import {CentresRepository} from '../../repositories';
import {setupApplication} from './test-helper';

describe('CentreController', () => {
  let app: VaccinationApp;
  let client: Client;
  let centresRepository: CentresRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    centresRepository = await app.getRepository(CentresRepository);
  });

  afterEach(async () => {
    await centresRepository.deleteAll();
  });

  after(async () => {
    await app.stop();
  });

  describe('GET /centres', () => {
    it('should get all centers', async () => {
      await centresRepository.create({
        name: 'Stark Tower',
        address: 'New york city',
        vaccineType: 'Serum',
      });

      await client.get(`/centres`).expect(200);
    });
  });
});
