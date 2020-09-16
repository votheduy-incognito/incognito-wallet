import { createSelector } from 'reselect';
import { CONSTANT_KEYS } from '@src/constants';
import { isEqual } from 'lodash';
import { listAccountSelector } from './account';

export const receiversSelector = createSelector(
  (state) => state.receivers,
  (receivers) => receivers,
);

export const sendInReceiversSelector = createSelector(
  receiversSelector,
  (receivers) => receivers[CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK],
);

export const withdrawReceiversSelector = createSelector(
  receiversSelector,
  (receivers) => receivers[CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK],
);

export const isKeychainAddressSelector = createSelector(
  listAccountSelector,
  (accounts) => (receiver) => {
    const isKeychainAddress = accounts.some((account) => {
      const isKeychain =
        isEqual(account?.paymentAddress, receiver?.address) &&
        isEqual(account?.accountName, receiver?.name);
      return isKeychain;
    });
    return isKeychainAddress;
  },
);

export const selectedReceiverSelector = createSelector(
  receiversSelector,
  (receivers) => receivers?.selected,
);
