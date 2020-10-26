import {
  appSchema,
  tableSchema
} from '@nozbe/watermelondb';
import { AccountCached } from '@src/database/consts/watermelonDB.const';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: AccountCached.ACCOUNT_CACHEDS,
      columns: [
        {
          name: AccountCached.CACHED_VALUE,
          type: 'string'
        },
      ]
    }),
  ]
});