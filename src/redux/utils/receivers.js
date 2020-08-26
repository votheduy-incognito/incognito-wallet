import { lowerCase, isEqual } from 'lodash';

export const isReceiverExist = (
  oldReceivers = [],
  receiver = { name: '', address: '' },
) =>
  oldReceivers.some(
    (item) =>
      isEqual(item?.address, receiver.address) ||
      isEqual(lowerCase(item?.name), lowerCase(receiver.name)),
  );
