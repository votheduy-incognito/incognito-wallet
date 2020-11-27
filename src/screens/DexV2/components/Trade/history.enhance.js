import React, { useState } from 'react';
import _ from 'lodash';
import { getHistories } from '@services/api/pdefi';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { LIMIT } from '@screens/DexV2/constants';

const withHistory = WrappedComp => (props) => {
  const [loading, setLoading] = useState(false);
  const [histories, setHistories] = useState([]);

  const { accounts } = props;

  const loadHistories = async () => {
    if (!_.isEmpty(accounts)) {
      try {
        setHistories([]);
        setLoading(true);
        const newData = await getHistories(accounts, [], 0, LIMIT);
        setHistories(newData);
      } catch (error) {
        new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_TRADE_HISTORIES).showErrorToast();
      } finally {
        setLoading(false);
      }
    }
  };

  React.useEffect(() => {
    if (!loading) {
      loadHistories();
    }
  }, [accounts]);

  return (
    <WrappedComp
      {...{
        ...props,
        histories,
      }}
    />
  );
};

export default withHistory;
