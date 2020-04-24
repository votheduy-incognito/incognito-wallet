import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {ExHandler} from '@src/services/exception';
import {useSelector} from 'react-redux';
import {removeAccount} from '@src/redux/actions/account';
import {actionImportAccount} from '@src/redux/actions';
import {actionToggleModal} from '@src/components/Modal';
import {pStakeAccountSelector} from '@screens/Stake/stake.selector';
import {actionFetch as actionFetchStake} from '@screens/Stake/stake.actions';
import {reloadAccountList} from '@src/redux/actions/wallet';
import {isNotFoundStakeAccount} from '@src/screens/Stake/stake.utils';
import RecoverAccountSuccess from './RecoverAccountSuccess';

const enhance = WrappedComp => props => {
  const pStakeAccount = useSelector(pStakeAccountSelector);
  const handleImportAccount = async (values, dispatch) => {
    const {privateKey} = values;
    try {
      if (isNotFoundStakeAccount(pStakeAccount)) {
        throw 'Something went wrong! pStake account can\'t not found!';
      }
      if (pStakeAccount?.PrivateKey === privateKey) {
        throw 'Please make sure this private key is valid and does not already exist on your device.';
      }
      if (!privateKey) {
        throw 'Private key is not found';
      }
      await dispatch(removeAccount(pStakeAccount));
      await dispatch(reloadAccountList());
      await dispatch(
        actionImportAccount({
          privateKey,
          accountName: pStakeAccount?.name || pStakeAccount?.AccountName,
        }),
      );
      await dispatch(actionFetchStake());
      await dispatch(
        actionToggleModal({
          visible: true,
          data: <RecoverAccountSuccess />,
        }),
      );
    } catch (error) {
      if (isNotFoundStakeAccount(pStakeAccount)) {
        await dispatch(
          actionImportAccount({
            privateKey: pStakeAccount?.PrivateKey,
            accountName: pStakeAccount?.name || pStakeAccount?.AccountName,
          }),
        );
      }
      new ExHandler(error).toastMessageError();
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, handleImportAccount}} />
    </ErrorBoundary>
  );
};

export default enhance;
