import {
  ACTION_ADD_STORAGE_DATA_DECENTRALIZED,
  ACTION_REMOVE_STORAGE_DATA_DECENTRALIZED,
  ACTION_ADD_STORAGE_DATA_CENTRALIZED,
  ACTION_REMOVE_STORAGE_DATA_CENTRALIZED,
} from './UnShield.constant';

export const actionAddStorageDataDecentralized = (
  payload = { keySave: '', tx: '' },
) => ({
  type: ACTION_ADD_STORAGE_DATA_DECENTRALIZED,
  payload,
});

export const actionRemoveStorageDataDecentralized = (
  payload = { keySave: '', burningTxId: '' },
) => ({
  type: ACTION_REMOVE_STORAGE_DATA_DECENTRALIZED,
  payload,
});

export const actionAddStorageDataCentralized = (
  payload = { keySave: '', tx: '' },
) => ({
  type: ACTION_ADD_STORAGE_DATA_CENTRALIZED,
  payload,
});

export const actionRemoveStorageDataCentralized = (
  payload = { keySave: '', txId: '' },
) => ({
  type: ACTION_REMOVE_STORAGE_DATA_CENTRALIZED,
  payload,
});
