import {repository} from '@loopback/repository';
import {getModelSchemaRef, post} from '@loopback/rest';
import moment from 'moment';
import {StaffSchedules} from '../models';
import {
  CentresRepository,
  StaffRepository,
  StaffSchedulesRepository,
} from '../repositories';

export class StaffScheduleController {
  constructor(
    @repository(StaffSchedulesRepository)
    public staffSchedulesRepository: StaffSchedulesRepository,
    @repository(StaffRepository)
    public staffRepository: StaffRepository,
    @repository(CentresRepository)
    public centresRepository: CentresRepository,
  ) {}

  /**
   * This endpoint is just to generate the seed data.
   */
  @post('/service/staff-schedules/init', {
    tags: ['ServiceEndpoints', 'Staff'],
    responses: {
      '200': {
        description: 'StaffSchedules model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(StaffSchedules)},
        },
      },
    },
  })
  async create(): Promise<StaffSchedules[]> {
    const allCentres = await this.centresRepository.find();
    const allStaff = await this.staffRepository.find();

    // With the given staff availability and the centres the number of staffPerCenter will be:
    const staffPerCenter = Math.floor(allStaff.length / allCentres.length);

    // Manning schedule with staff and centres.
    const staffSchedules = allStaff.map((staff, i) => {
      const center = allCentres[Math.floor(i / staffPerCenter)];
      return new StaffSchedules({
        staffId: staff.id,
        centreId: center.id,
        assignmentStartAt: moment().utc().format(),
        assignmentEndAt: moment().utc().add(1, 'month').format(),
      });
    });

    //return staffSchedules;
    return this.staffSchedulesRepository.createAll(staffSchedules);
  }
}
