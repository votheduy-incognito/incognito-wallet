import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionUpdateBalance as updateBalance,
  actionLoadInputBalance as loadInputBalance,
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';

const enhanceBalanceLoader = WrappedComp => (props) => {

  const dispatch = useDispatch();

  const {
    inputToken,
    feeToken,
    pairTokens,
    account,
    wallet,
  } = props;

  const loadBalance = () => {
    dispatch(loadInputBalance({ account, wallet }));
  };

  useEffect(() => {
    dispatch(updateBalance({ inputBalance: null }));
    if (feeToken) {
      loadBalance();
    }
  }, [account, feeToken, pairTokens, inputToken]);

  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default enhanceBalanceLoader;
