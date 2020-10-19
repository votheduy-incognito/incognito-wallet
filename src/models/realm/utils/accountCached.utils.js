import Realm from 'realm';
import { SCHEMA_ACCOUNT } from '@models/realm/schema.const';
import { databaseOptions } from '@models/realm/schema/accountCached.schema';

export const getAccountKey = (accountName, type) => {
  return `${accountName}-${type}`;
};

/*
* insert row
* */
export const insertAccountCached = (value, accountName, type) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions)
    .then(realm => {
      realm.write(() => {
        const name      = getAccountKey(accountName, type);
        let existValue  = realm.objectForPrimaryKey(SCHEMA_ACCOUNT.DATABASE_NAME, name);
        if(existValue) {
          existValue['value'] = value;
          resolve(existValue);
          return;
        }
        const object = {name, value};
        realm.create(SCHEMA_ACCOUNT.DATABASE_NAME, object);
        resolve(object);
      });
    }).catch((error) => reject(error));
});

/*
* delete all
* */
export const deleteAccountCachedWith = (accountName) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions)
    .then(realm => {
      realm.write(() => {
        const serialKey     = getAccountKey(accountName, SCHEMA_ACCOUNT.SERIAL);
        const spentCoinKey  = getAccountKey(accountName, SCHEMA_ACCOUNT.SPENT_COIN);
        let deleteSerial    = realm.objectForPrimaryKey(
          SCHEMA_ACCOUNT.DATABASE_NAME,
          serialKey
        );
        let deleteSpentCoin    = realm.objectForPrimaryKey(
          SCHEMA_ACCOUNT.DATABASE_NAME,
          spentCoinKey
        );
        if (deleteSerial) {
          realm.delete(deleteSerial);
        }
        if (deleteSpentCoin) {
          realm.delete(deleteSpentCoin);
        }
        resolve();
      });
    }).catch((error) => reject(error));
});

/*
* query
* */
export const queryAccountCached = (accountName) => new Promise((resolve, reject) => {
  Realm.open(databaseOptions)
    .then(realm => {
      const serialKey     = getAccountKey(accountName, SCHEMA_ACCOUNT.SERIAL);
      const spentCoinKey  = getAccountKey(accountName, SCHEMA_ACCOUNT.SPENT_COIN);
      const serial        = realm.objectForPrimaryKey(
        SCHEMA_ACCOUNT.DATABASE_NAME,
        serialKey
      ) || {};
      const spentCoin     = realm.objectForPrimaryKey(
        SCHEMA_ACCOUNT.DATABASE_NAME,
        spentCoinKey
      ) || {};
      resolve({
        derivatorToSerialNumberCache: serial,
        spentCoinCached: spentCoin
      });
    }).catch((error) => {
      reject(error);
    });
});