import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { nodeSelector } from '@screens/Node/Node.selector';

const enhanceData = WrappedComp => props => {

  const {
    listDevice,
    noRewards,
    nodeRewards,
    isFetching,
    isRefreshing,
    isFetched,
    withdrawTxs,
    withdrawing
  } = useSelector(nodeSelector);

  const [errorStorage, setErrorStorage] = React.useState(null);

  const handleSetErrorStorage = (error) => {
    if (error && error.message && error.message.includes('disk')) {
      setErrorStorage(error);
    }
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          listDevice,
          noRewards,
          nodeRewards,
          isFetching,
          isRefreshing,
          isFetched,
          withdrawTxs,
          withdrawing,
          errorStorage,
          setErrorStorage: handleSetErrorStorage,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceData;