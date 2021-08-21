import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {
      schema: 'public',
      table: 'slots',
    },
    scope: {
      deleteAt: null,
    },
    strict: false,
  },
})
export class Slots extends Entity {
  @property({
    type: 'number',
    required: true,
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
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'start_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  startAt: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'end_at',
      dataType: 'timestamp without time zone',
      dataLength: null,
      dataPrecision: null,
      dataScale: null,
      nullable: 'NO',
    },
  })
  endAt: string;

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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Slots>) {
    super(data);
  }
}

export interface SlotsRelations {
  // describe navigational properties here
}

export type SlotsWithRelations = Slots & SlotsRelations;
