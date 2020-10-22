import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { withPairs } from '@screens/DexV2/features/Pairs';
import { witHistories } from '@screens/DexV2/features/Histories';
import { actionFreeTradeData } from '@screens/DexV2/features/Trade';
import { useDispatch } from 'react-redux';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const handleFreeTradeData = () => {
    try {
      dispatch(actionFreeTradeData());
    } catch (error) {
      console.debug('FREE_TRADE_DATA_FAIL', error);
    }
  };
  React.useEffect(() => {
    return () => {
      handleFreeTradeData();
    };
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  withPairs,
  witHistories,
  enhance,
);
