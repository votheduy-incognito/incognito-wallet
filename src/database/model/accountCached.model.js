import { Model } from '@nozbe/watermelondb';
import { field, action } from '@nozbe/watermelondb/decorators';
import { AccountCached } from '@src/database/consts/watermelonDB.const';

export default class AccountCachedModel extends Model {
  static table = AccountCached.ACCOUNT_CACHEDS

  @field('value') value;

  @action async delete() {
    await super.markAsDeleted();
  }

  @action async updateAccountCached(value) {
    await this.update((account) => {
      account._raw.value = value;
    });
  }
}
