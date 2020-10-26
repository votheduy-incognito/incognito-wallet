import { AsyncStorage } from 'react-native';
import { saveAccountCached } from '@src/database/helper/accountCached.helpers';

const isMirageKey = (accountName) => (`isCached-${accountName}`);

export const setIsMirage = async (accountName) => {
  await AsyncStorage.setItem(isMirageKey(accountName), JSON.stringify(true));
};

export const getIsMirage = async (accountName) => {
  if(!accountName) return false;
  return JSON.parse(await AsyncStorage.getItem(isMirageKey(accountName)));
};

export const handleCachedAccount = async (account) => {
  const accountName = account?.name;
  const cached = {
    serials: account?.derivatorToSerialNumberCache || {},
    spentCoin: account?.spentCoinCached || {}
  };
  const start = new Date().getTime();
  await saveAccountCached(accountName, cached);
  const end = new Date().getTime();
  console.log(`Save account in: ${end - start}Ms`);
  await setIsMirage(accountName);
};