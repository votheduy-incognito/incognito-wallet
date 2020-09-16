import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { loadAccountHistory, normalizeData } from '@src/redux/utils/token';
import { useDispatch, useSelector } from 'react-redux';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { useFocusEffect } from 'react-navigation-hooks';
import { accountSeleclor } from '@src/redux/selectors';
import { getStatusData } from '@src/components/HistoryList/HistoryList.utils';
import { useStreamLine } from './Streamline.useStreamline';
import { actionInit } from './Streamline.actions';

const enhance = (WrappedComp) => (props) => {
  const [state, setState] = React.useState({
    isPending: false,
    isFetching: true,
    isFetched: false,
  });
  const { isFetching, isFetched, isPending } = state;
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const dispatch = useDispatch();
  const { data } = useStreamLine();
  const handleFetchData = async () => {
    let _isPending = false;
    try {
      await dispatch(actionInit());
      const accountHistory = await dispatch(loadAccountHistory());
      const historiesMainCrypto = normalizeData(
        accountHistory,
        CONSTANT_COMMONS.PRV.pDecimals,
        CONSTANT_COMMONS.PRV.pDecimals,
      );
      const utxos = data[(account?.paymentAddress)] || [];
      const histories = historiesMainCrypto
        ?.filter((history) =>
          utxos.find((txId) => txId === history?.incognitoTxID),
        )
        .map((history) => ({ ...history, ...getStatusData(history?.status) }));
      _isPending = histories.some(
        (history) => history?.statusText === 'Pending',
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setState({
        ...state,
        isFetching: false,
        isFetched: true,
        isPending: _isPending,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFetchData();
    }, [data]),
  );
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          isFetching,
          showPending: isFetched && !isFetching && isPending,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
