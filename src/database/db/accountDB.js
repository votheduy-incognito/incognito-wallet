import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import AccountCachedModel from '@src/database/model/accountCached.model';
import AccountCachedSchema from '@src/database/schema/accountCached.schema';
import { AccountCached } from '@src/database/consts/watermelonDB.const';

const adapter = new SQLiteAdapter({
  dbName: 'accountsDB',
  schema: AccountCachedSchema,
});

const database = new Database({
  adapter,
  modelClasses: [AccountCachedModel],
  actionsEnabled: true,
});

export default database;
