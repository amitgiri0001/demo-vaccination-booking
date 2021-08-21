import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'staff'},
    scope: {
      deleteAt: null,
    },
  },
})
export class Staff extends Entity {
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

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Staff>) {
    super(data);
  }
}

export interface StaffRelations {
  // describe navigational properties here
}

export type StaffWithRelations = Staff & StaffRelations;
