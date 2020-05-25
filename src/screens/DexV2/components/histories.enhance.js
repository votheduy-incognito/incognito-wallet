import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { getHistories } from '@services/api/pdefi';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { useFocusEffect } from 'react-navigation-hooks';
import { LIMIT } from '@screens/DexV2/constants';

const withHistories = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);
  const [page, setPage] = useState(1);

  useFocusEffect(useCallback(() => {
    reload();
  }, []));

  const { accounts, pairTokens } = props;

  const reload = () => {
    if (!loading) {
      if (page !== 1) {
        setPage(1);
      } else {
        loadHistories();
      }
    }
  };

  const loadHistories = async () => {
    if (!_.isEmpty(accounts) && !_.isEmpty(pairTokens)) {
      try {
        setLoading(true);
        const limit = histories.length <= LIMIT * page ? histories.length || LIMIT : LIMIT;
        const newData = await getHistories(accounts, pairTokens, page, limit);
        const newIds = newData.map(item => item.id);
        const mergedData = _(newData)
          .concat(histories.filter(item => !newIds.includes(item.id)))
          .orderBy(item => item.id, 'desc')
          .uniqBy(item => item.id)
          .value();

        setHistories(mergedData);
      } catch (error) {
        new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_TRADE_HISTORIES).showErrorToast();
      } finally {
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    if (!loading) {
      setPage(page + 1);
    }
  };

  React.useEffect(() => {
    if (!loading) {
      loadHistories();
    }
  }, [accounts, pairTokens, page]);

  return (
    <WrappedComp
      {...{
        ...props,
        histories,
        isLoadingHistories: loading,
        onLoadMoreHistories: loadMore,
        onReloadHistories: reload,
      }}
    />
  );
};

export default withHistories;
