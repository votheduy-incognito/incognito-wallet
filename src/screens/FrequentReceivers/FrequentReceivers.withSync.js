import React from 'react';
import { listAccountSelector } from '@src/redux/selectors/account';
import { useSelector, useDispatch } from 'react-redux';
import {
  actionMigrateIncognitoAddress,
  actionDelete,
} from '@src/redux/actions/receivers';
import { CONSTANT_KEYS } from '@src/constants';
import { receiversSelector } from '@src/redux/selectors/receivers';
import { isEqual } from 'lodash';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const accounts = useSelector(listAccountSelector);
  const keySave = CONSTANT_KEYS.REDUX_STATE_RECEIVERS_IN_NETWORK;
  const sendInReceivers = useSelector(receiversSelector)[keySave];
  const { migrateIncognitoAddress, receivers } = sendInReceivers;
  const handleMigrateIncognitoAddress = async () => {
    try {
      const isAccListEmpty = accounts.length === 0;
      if (!isAccListEmpty) {
        const receiversSynced = receivers
          .filter((receiver) => {
            const isReceiverSync = accounts.some(
              (account) =>
                isEqual(account?.paymentAddress, receiver?.address) &&
                isEqual(account?.accountName, receiver?.name),
            );
            return isReceiverSync;
          })
          .map((receiver) => dispatch(actionDelete({ keySave, receiver })));
        await new Promise.all(receiversSynced);
      }
    } catch (error) {
      console.debug(error);
    } finally {
      dispatch(actionMigrateIncognitoAddress(keySave));
    }
  };

  React.useEffect(() => {
    if (!migrateIncognitoAddress) {
      handleMigrateIncognitoAddress();
    }
  }, [accounts]);

  return <WrappedComp {...props} />;
};

export default enhance;
