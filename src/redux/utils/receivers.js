import { toLower, isEqual } from 'lodash';

export const isReceiverExist = (
  oldReceivers = [],
  receiver = { name: '', address: '' },
) =>
  oldReceivers.some(
    (item) =>
      isEqual(item?.address, receiver.address) ||
      isEqual(toLower(item?.name), toLower(receiver.name)),
  );
