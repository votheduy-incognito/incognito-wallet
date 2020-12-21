import React, { useEffect } from 'react';
import { COINS } from '@src/constants';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import {
  actionGetNetworkFee as getNetworkFee
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';

const enhanceEstimateFee = WrappedComp => (props) => {
  const dispatch = useDispatch();

  const { inputToken, outputToken, fee, feeToken } = props;

  const inputFee  = feeToken?.id === inputToken.id ? fee : 0;
  const prvFee    = feeToken?.id === COINS.PRV_ID ? fee : 0;

  const estimateFee = () => {
    dispatch(getNetworkFee());
  };

  useEffect(() => {
    if (isEmpty(inputToken) || isEmpty((outputToken))) return;
    estimateFee();
  }, [inputToken, outputToken]);

  return (
    <WrappedComp
      {...{
        ...props,

        inputFee,
        prvFee,
      }}
    />
  );
};

export default enhanceEstimateFee;
