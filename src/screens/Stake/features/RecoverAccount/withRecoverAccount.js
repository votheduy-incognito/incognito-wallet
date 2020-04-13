import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {ExHandler} from '@src/services/exception';
import {useSelector} from 'react-redux';
import {removeAccount} from '@src/redux/actions/account';
import {actionImportAccount} from '@src/redux/actions';
import Modal, {actionToggleModal} from '@src/components/Modal';
import {pStakeAccountSelector} from '@screens/Stake/stake.selector';
import {actionFetch as actionFetchStake} from '@screens/Stake/stake.actions';
import RecoverAccountSuccess from './RecoverAccountSuccess';

const enhance = WrappedComp => props => {
  const pStakeAccount = useSelector(pStakeAccountSelector);
  const handleImportAccount = async (values, dispatch) => {
    try {
      const {privateKey} = values;
      await dispatch(removeAccount(pStakeAccount));
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
      new ExHandler(error).showErrorToast();
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, handleImportAccount}} />
      <Modal />
    </ErrorBoundary>
  );
};

export default enhance;
