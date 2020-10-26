import { AccountCached } from '@src/database/consts/watermelonDB.const';
import database from '@src/database/db/accountDB';
import { Q } from '@nozbe/watermelondb';
import {ExHandler} from '@services/exception';
import _ from 'lodash';

export const ACCOUNT_CACHED_SUFFIX = {
  SERIAL: 'serial',
  SPENT_COIN: 'spentCoin'
};

const formatName = (accountName, suffix) => {
  return accountName + suffix;
};

export const formatCachedResult = (data) => {
  let result = {};
  if (_.isArray(data) && data.length > 0) {
    const { value } = _.head(data)._raw;
    result = JSON.parse(value) || {};
  }
  return result;
};

const getCollection = () => database.collections.get(AccountCached.ACCOUNT_CACHEDS);

/*
* Action load
* */
export const loadAccountCached = async (accountName) => {
  try {
    const serialName    = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SERIAL);
    const spentCoinName = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SPENT_COIN);
    const cachedPromise = [];

    const promiseSerials = getCollection()
      .query(Q.where('id', serialName)).fetch();
    cachedPromise.push(promiseSerials);

    const promiseSpentCoin = getCollection()
      .query(Q.where('id', spentCoinName)).fetch();
    cachedPromise.push(promiseSpentCoin);

    const [serials, spentCoin] = await Promise.all(cachedPromise);

    return {
      derivatorToSerialNumberCache: formatCachedResult(serials),
      spentCoinCached: formatCachedResult(spentCoin)
    };

  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

export const loadSerialsCached = async (accountName) => {
  try {
    const serialName  = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SERIAL);
    const serials     = await getCollection()
      .query(Q.where('id', serialName)).fetch();
    return formatCachedResult(serials);
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

export const loadSpentCoinCached = async (accountName) => {
  try {
    const spentCoinName = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SPENT_COIN);
    const spentCoin     = await getCollection()
      .query(Q.where('id', spentCoinName)).fetch();
    return formatCachedResult(spentCoin);
  } catch (e) {
    new ExHandler(e).showErrorToast();
  }
};

/*
* Update
* */
export const updateSerialsCached = async (accountName, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database.action(async () => {
        const serialName    = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SERIAL);
        const serials = await getCollection()
          .query(Q.where('id', serialName)).fetch();
        if (_.isArray(serials) && serials.length > 0) {
          const serial = serials[0];
          serial.updateAccountCached(value)
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          resolve(false);
        }
      });
    } catch (e) {
      new ExHandler(e).showErrorToast();
      reject(e);
    }
  });
};

export const updateSpentCoinCached = async (accountName, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      await database.action(async () => {
        const spentCoinName = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SPENT_COIN);
        const spentCoins = await getCollection()
          .query(Q.where('id', spentCoinName)).fetch();
        if (_.isArray(spentCoins) && spentCoins.length > 0) {
          const spentCoin = spentCoins[0];
          spentCoin.updateAccountCached(value)
            .then(() => {
              resolve(true);
            })
            .catch((e) => {
              reject(e);
            });
        } else {
          resolve(false);
        }
      });
    } catch (e) {
      new ExHandler(e).showErrorToast();
      reject(e);
    }
  });
};

/*
* Action save
* */
export const saveAccountCached = async (accountName, data) => {
  try {
    const serialName    = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SERIAL);
    const spentCoinName = formatName(accountName, ACCOUNT_CACHED_SUFFIX.SPENT_COIN);
    const cachedPromise = [];

    const serials   = JSON.stringify(data?.serials);
    const spentCoin = JSON.stringify(data?.spentCoin);

    /*
    * check exist row
    * if exist update
    * */
    const [serialUpdated, spentCoinUpdated] = await Promise.all([
      updateSerialsCached(accountName, serials),
      updateSpentCoinCached(accountName, spentCoin)
    ]);

    /*
    * make sure dont exist row
    * create new row
    * */
    await database.action(async () => {
      if (!serialUpdated) {
        const promiseSerials = getCollection()
          .create(account => {
            account._raw.id = serialName;
            account._raw.value = serials;
          });
        cachedPromise.push(promiseSerials);
      }

      if (!spentCoinUpdated) {
        const promiseSpentCoin = getCollection()
          .create(account => {
            account._raw.id = spentCoinName;
            account._raw.value = spentCoin;
          });
        cachedPromise.push(promiseSpentCoin);
      }
      return Promise.all(cachedPromise);
    });
  } catch (e) {
    console.log('Save Account with error: ', e);
  }
};