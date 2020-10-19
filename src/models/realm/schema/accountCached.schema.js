import { SCHEMA_ACCOUNT } from '@models/realm/schema.const';

export const AccountSchema = {
  name: SCHEMA_ACCOUNT.DATABASE_NAME,
  primaryKey: SCHEMA_ACCOUNT.SCHEMA_KEY,
  properties: {
    name: {
      type: 'string',
      indexed: true
    },// primary key
    value: {
      type: 'string'
    }
  }
};

export const databaseOptions = {
  path: SCHEMA_ACCOUNT.FILE_NAME,
  schema: [AccountSchema],
};