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
import { actionInitProccess, actionTogglePending } from './Streamline.actions';

const enhance = (WrappedComp) => (props) => {
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({ refresh: false });
  const { refresh } = state;
  const { data, times } = useStreamLine();
  const handleFetchData = async () => {
    let _isPending = false;
    try {
      if (refresh) {
        return;
      }
      await setState({ ...state, refresh: true });
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
        .map((history) => ({ ...history, ...getStatusData(history) }));
      _isPending = histories.some(
        (history) => history?.statusMessage === 'Pending',
      );
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      dispatch(actionTogglePending(_isPending));
      await setState({ ...state, refresh: false });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleFetchData();
    }, [data]),
  );

  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionInitProccess({ times }));
      handleFetchData();
    }, [account]),
  );

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleFetchData,
          refresh,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
