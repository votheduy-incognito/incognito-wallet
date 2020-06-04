import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tokenSeleclor } from '@src/redux/selectors';
import EmptyHistory from './MainCryptoHistory.empty';

const enhance = WrappedComp => props => {
  const { isEmpty } = useSelector(tokenSeleclor.historyTokenSelector);
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
