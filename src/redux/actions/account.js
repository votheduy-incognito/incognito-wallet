import type from '@src/redux/types/account';

export const setAccount = (account = throw new Error('Account object is required')) => ({
  type: type.SET,
  data: account
});

export const setBulkAccount = (accounts = throw new Error('Account array is required')) => {
  if (accounts && accounts.constructor !== Array) {
    throw new TypeError('Accounts must be an array');
  }

  return ({
    type: type.SET_BULK,
    data: accounts
  });
};

export const removeAllAccount = () => ({
  type: type.REMOVE_ALL,
});

export const removeAccountByName = (accountName = throw new Error('Account name is required')) => ({
  type: type.REMOVE_BY_NAME,
  data: accountName
});