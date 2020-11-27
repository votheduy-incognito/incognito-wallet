import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import { getHistories } from '@services/api/pool';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { useFocusEffect } from 'react-navigation-hooks';

const withHistories = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [accountHistories, setAccountHistories] = useState({});
  const { account } = props;

  const loadHistories = async (account) => {
    try {
      setLoading(true);
      const data = await getHistories(account, 1, 1, []);
      accountHistories[account.PaymentAddress] = data.items;
      setAccountHistories({
        ...accountHistories,
      });
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_POOL_HISTORIES).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  const debounceLoadHistories = useCallback(_.debounce(loadHistories, 200), []);

  useFocusEffect(useCallback(() => {
    setAccountHistories({
      ...accountHistories,
      [account.PaymentAddress]: [],
    });
    debounceLoadHistories.cancel();
    debounceLoadHistories(account);
  }, [account.PaymentAddress]));

  return (
    <WrappedComp
      {...{
        ...props,
        histories: accountHistories[account?.PaymentAddress] || [],
        isLoadingHistories: loading,
      }}
    />
  );
};

export default withHistories;
