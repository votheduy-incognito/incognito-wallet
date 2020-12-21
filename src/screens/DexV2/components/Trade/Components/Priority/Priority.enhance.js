import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import {
  actionChangeInputText as changeInputText,
  actionUpdatePriority as updatePriority,
  actionUpdateTradeFee as updateTradeFee
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { PRV_ID } from '@screens/Dex/constants';
import {
  NETWORK_FEE_PRV,
  PRIORITY_KEY
} from '@screens/DexV2/components/Trade/TradeV2/Trade.appConstant';

const enhancePriority = WrappedComp => props => {

  const dispatch = useDispatch();

  const {
    priorityList,
    priority,
    originalFeeToken,
    originalFee,
    inputText,
    isErc20,
  } = useSelector(tradeSelector);

  const handleChoosePriority = (newPriority) => {
    if (newPriority === priority) return;
    dispatch(updatePriority({ priority: newPriority }));

    // Case user can choose Free by pToken
    if (originalFeeToken?.id !== PRV_ID) {
      const payload = newPriority !== PRIORITY_KEY.MEDIUM
        ? NETWORK_FEE_PRV
        : { fee: originalFee, feeToken: originalFeeToken };

      dispatch(updateTradeFee(payload));
    }

    if (isErc20) return;

    // Calculator output value again because token fee change
    dispatch(changeInputText(inputText));
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          priorityList,
          priority,

          handleChoosePriority
        }}
      />
    </ErrorBoundary>
  );
};

export default enhancePriority;