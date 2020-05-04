import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {ExHandler} from '@src/services/exception';
import {useSelector} from 'react-redux';
import {removeAccount} from '@src/redux/actions/account';
import {actionImportAccount} from '@src/redux/actions';
import {actionToggleModal} from '@src/components/Modal';
import {
  pStakeAccountSelector,
  storageStakeSelector,
} from '@screens/Stake/stake.selector';
import {
  actionFetch as actionFetchStake,
  actionBackupCreateStake,
} from '@screens/Stake/stake.actions';
import {reloadAccountList} from '@src/redux/actions/wallet';
import {isNotFoundStakeAccount} from '@src/screens/Stake/stake.utils';
import {accountSeleclor} from '@src/redux/selectors';
import RecoverAccountSuccess from './RecoverAccountSuccess';

const enhance = WrappedComp => props => {
  const pStakeAccount = useSelector(pStakeAccountSelector);
  const accountList = useSelector(accountSeleclor.listAccount);
  const {backup} = useSelector(storageStakeSelector);
  const handleImportAccount = async (values, dispatch) => {
    const {privateKey: privateKeyValue} = values;
    const privateKey = privateKeyValue?.trim();
    try {
      if (isNotFoundStakeAccount(pStakeAccount)) {
        throw 'Something went wrong! pStake account can\'t not found!';
      }
      if (
        pStakeAccount?.PrivateKey === privateKey ||
        accountList.some(item => item?.PrivateKey === privateKey) ||
        !privateKey
      ) {
        throw 'Please make sure this private key is valid and does not already exist on your device.';
      }
      await dispatch(removeAccount(pStakeAccount));
      await dispatch(
        actionImportAccount({
          privateKey,
          oldPrivateKey: pStakeAccount?.PrivateKey,
          accountName: pStakeAccount?.name || pStakeAccount?.AccountName,
        }),
      );
      await dispatch(actionFetchStake());
      if (!backup) {
        await dispatch(actionBackupCreateStake());
      }
      await dispatch(
        actionToggleModal({
          visible: true,
          data: <RecoverAccountSuccess />,
        }),
      );
    } catch (error) {
      new ExHandler(error).toastMessageError();
    } finally {
      await dispatch(reloadAccountList());
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, handleImportAccount}} />
    </ErrorBoundary>
  );
};

export default enhance;
