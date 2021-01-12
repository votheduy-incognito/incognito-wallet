import { createSelector } from 'reselect';

const masterKeyReducerSelector = (state) => state.masterKey;

export const masterlessKeyChainSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list.find(item =>
    item.name.toLowerCase() === 'unlinked' ||
    item.name.toLowerCase() === 'masterless'
  ),
);

export const noMasterLessSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list.filter(item => item.name.toLowerCase() !== 'masterless'),
);

export const masterKeysSelector = createSelector(
  masterKeyReducerSelector,
  (masterKey) => masterKey.list,
);

export const currentMasterKeySelector = createSelector(
  masterKeysSelector,
  (list) => list.find(item => item.isActive) || list[0],
);


export const listAllMasterKeyAccounts = createSelector(
  masterKeyReducerSelector,
  state => state.accounts || [],
);
