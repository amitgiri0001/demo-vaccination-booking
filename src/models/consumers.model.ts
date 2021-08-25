import {Entity, hasMany, model, property} from '@loopback/repository';
import moment from 'moment';
import {Bookings} from './bookings.model';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'consumers'},
    scope: {
      where: {
        deletedAt: null,
      },
    },
  },
})
export class Consumers extends Entity {
  @property({
    type: 'date',
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
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'character varying',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  name: string;

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
  id: number;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'national_id',
      dataType: 'character varying',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  nationalId: string;

  @hasMany(() => Bookings, {keyTo: 'consumerId'})
  bookings: Bookings[];

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'birthday',
      dataType: 'date',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  birthday: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Consumers>) {
    super(data);
  }
}

export interface ConsumersRelations {
  // describe navigational properties here
}

export type ConsumersWithRelations = Consumers & ConsumersRelations;
