import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { totalFeeSelector, tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { COINS } from '@src/constants';
import { actionUpdateTradeFee } from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { cloneDeep } from 'lodash';

const enhanceFeeEdited = WrappedComp => props => {

  const {
    feeToken,
    originalFee,
    originalFeeToken,
    canChooseFee,
  } = useSelector(tradeSelector);

  const dispatch = useDispatch();
  const totalFee = useSelector(totalFeeSelector);

  const isPRV = feeToken.id === COINS.PRV_ID;

  const onPrvPress = () => {
    if (isPRV) return;
    dispatch(actionUpdateTradeFee({
      fee: 400,
      feeToken: COINS.PRV
    }));
  };

  const onTokenPress = () => {
    if (!isPRV) return;
    dispatch(actionUpdateTradeFee({
      fee: cloneDeep(originalFee),
      feeToken: cloneDeep(originalFeeToken)
    }));
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          isPRV,
          totalFee,
          canChooseFee,
          originalFeeToken,

          onTokenPress,
          onPrvPress,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceFeeEdited;