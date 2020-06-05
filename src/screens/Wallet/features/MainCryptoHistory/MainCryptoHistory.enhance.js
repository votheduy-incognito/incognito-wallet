import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import EmptyHistory from './MainCryptoHistory.empty';

const enhance = (WrappedComp) => (props) => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const isEmpty = selectedPrivacy?.amount === 0;
  if (isEmpty) {
    return <EmptyHistory />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
