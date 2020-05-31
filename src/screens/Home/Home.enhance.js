import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';
import Modal from '@src/components/Modal';
import withFCM from '@src/screens/Notification/Notification.withFCM';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import { useSelector } from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';

const enhance = WrappedComp => props => {
  const { getFollowingToken, clearWallet, fetchData } = props;
  const isFocused = useIsFocused();
  const wallet = useSelector(state => state?.wallet);
  React.useEffect(() => {
    if (wallet) {
      getFollowingToken();
    }
  }, [wallet]);
  React.useEffect(() => {
    if (isFocused) {
      clearWallet();
    }
  }, [isFocused]);
  React.useEffect(() => {
    fetchData();
  }, []);
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
