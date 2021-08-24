import {belongsTo, Entity, model, property} from '@loopback/repository';
import moment from 'moment';
import {Centres} from './centres.model';
import {Consumers} from './consumers.model';
import {Slots} from './slots.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'bookings'},
    scope: {
      deleteAt: null,
    },
  },
})
export class Bookings extends Entity {
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
    type: 'string',
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
  createdAt: string;

  @property({
    type: 'string',
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
    type: 'string',
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
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'booking_date',
      dataType: 'date',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  bookingDate: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'status',
      dataType: 'character varying',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  status?: string;

  @belongsTo(
    () => Centres,
    {},
    {
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
    },
  )
  centreId: number;

  @belongsTo(
    () => Consumers,
    {},
    {
      type: 'number',
      required: true,
      scale: 0,
      postgresql: {
        columnName: 'consumer_id',
        dataType: 'integer',
        dataLength: null,
        dataPrecision: null,
        dataScale: 0,
        nullable: 'NO',
      },
    },
  )
  consumerId: number;

  @belongsTo(
    () => Slots,
    {},
    {
      type: 'number',
      required: true,
      scale: 0,
      postgresql: {
        columnName: 'slot_id',
        dataType: 'integer',
        dataLength: null,
        dataPrecision: null,
        dataScale: 0,
        nullable: 'NO',
      },
    },
  )
  slotId: number;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Bookings>) {
    super(data);
  }
}

export interface BookingsRelations {
  // describe navigational properties here
}

export type BookingsWithRelations = Bookings & BookingsRelations;
