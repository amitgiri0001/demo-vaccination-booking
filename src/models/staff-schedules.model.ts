import {Entity, model, property} from '@loopback/repository';
import moment from 'moment';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'public',
      table: 'staff_schedules',
    },
    scope: {
      where: {
        deletedAt: null,
      },
    },
  },
})
export class StaffSchedules extends Entity {
  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
    default: () => moment().utc().format(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'updated_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
    default: () => moment().utc().format(),
  })
  updatedAt: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'deleted_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'YES',
    },
    hidden: true,
  })
  deletedAt?: string;

  @property({
    type: 'number',
    scale: 0,
    id: 1,
    postgresql: {
      columnName: 'id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {
      columnName: 'staff_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  staffId: number;

  @property({
    type: 'number',
    required: true,
    scale: 0,
    postgresql: {
      columnName: 'centre_id',
      dataType: 'integer',
      dataLength: null,
      dataPrecision: null,
      dataScale: 0,
      nullable: 'NO',
    },
  })
  centreId: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'assignment_start_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  assignmentStartAt: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'assignment_end_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  assignmentEndAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<StaffSchedules>) {
    super(data);
  }
}

export interface StaffSchedulesRelations {
  // describe navigational properties here
}

export type StaffSchedulesWithRelations = StaffSchedules &
  StaffSchedulesRelations;
