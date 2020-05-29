import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';
import Modal from '@src/components/Modal';
import withFCM from '@src/screens/Notification/Notification.withFCM';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import { useSelector } from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';
import { accountSeleclor } from '@src/redux/selectors';

const enhance = WrappedComp => props => {
  const { getFollowingToken, clearWallet, fetchData, isReloading } = props;
  const isFocused = useIsFocused();
  const account = useSelector(accountSeleclor.defaultAccount);
  const wallet = useSelector(state => state?.wallet);
  React.useEffect(() => {
    if (wallet) {
      getFollowingToken();
    }
  }, [wallet, account]);
  React.useEffect(() => {
    if (isFocused) {
      clearWallet();
    }
  }, [isFocused]);
  React.useEffect(() => {
    fetchData();
  }, []);
  console.log('isReloading', isReloading);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
      <Modal />
    </ErrorBoundary>
  );
};

export default compose(
  withNavigation,
  withFCM,
  withWallet,
  enhance,
);
