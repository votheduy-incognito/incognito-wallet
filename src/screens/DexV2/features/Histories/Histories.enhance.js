import React, { useCallback } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useFocusEffect } from 'react-navigation-hooks';
import { LIMIT } from '@screens/DexV2/constants';
import { useDispatch, useSelector } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import { pairsDataSelectors } from '@screens/DexV2/features/Pairs';
import { actionFetch, actionSetPage } from './Histories.actions';
import { historiesSelector } from './Histories.selector';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const accounts = useSelector(accountSeleclor.listAccountSelector);
  const { tokens } = useSelector(pairsDataSelectors);
  const { loading, page, histories } = useSelector(historiesSelector);
  const loadHistories = () => dispatch(actionFetch());
  const setPage = (page) => dispatch(actionSetPage(page));
  const reload = () => {
    if (!loading) {
      if (page !== 1) {
        setPage(1);
      } else {
        loadHistories();
      }
    }
  };
  const loadMore = () => {
    if (!loading) {
      const isFullPage = (histories || []).length % LIMIT === 0;
      const nextPage =
        Math.floor(histories.length / LIMIT) + (isFullPage ? 1 : 0);
      setPage(nextPage);
    }
  };

  useFocusEffect(
    useCallback(() => {
      reload();
    }, []),
  );

  React.useEffect(() => {
    loadHistories();
  }, [accounts, tokens, page]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          isLoadingHistories: loading,
          onReloadHistories: reload,
          onLoadMoreHistories: loadMore,
          histories,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
