export const isReceiverExist = (
  oldReceivers = [],
  receiver = {name: '', address: ''},
) =>
  oldReceivers.some(
    item => item?.address === receiver.address || item?.name === receiver.name,
  );
