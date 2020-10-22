import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { pairsSelector } from '@screens/DexV2/features/Pairs';
import { MAX_DEX_FEE } from '@components/EstimateFee/EstimateFee.utils';
import { MAX_PDEX_TRADE_STEPS } from '@screens/DexV2/constants';
import { calculateOutputValue } from '@screens/DexV2/components/Trade/utils';
import { COINS } from '@src/constants';
import { tradeSelector } from './Trade.selector';
import { actionSetFee, actionSetFeeToken } from './Trade.actions';

const enhance = (WrappedComp) => (props) => {
  const { inputToken, outputToken } = useSelector(tradeSelector);
  const { pairs } = useSelector(pairsSelector)?.data;
  const dispatch = useDispatch();
  const setFee = (payload) => dispatch(actionSetFee(payload));
  const setFeeToken = (payload) => dispatch(actionSetFeeToken(payload));
  const handleEstimateFee = () => {
    try {
      const prvFee = MAX_DEX_FEE;
      if (inputToken.id === COINS.PRV_ID || outputToken.id !== COINS.PRV_ID) {
        setFee(prvFee);
        setFeeToken(COINS.PRV);
        return;
      }
      const prvPair = (pairs || []).find(
        (item) =>
          item.keys.includes(inputToken.id) &&
          item.keys.includes(COINS.PRV_ID) &&
          item[COINS.PRV_ID] > 10000 * 1e9,
      );
      if (inputToken.id !== COINS.PRV_ID && prvPair) {
        const fee = Math.max(
          calculateOutputValue(prvPair, COINS.PRV, prvFee, inputToken),
          MAX_PDEX_TRADE_STEPS * 20,
        );
        setFeeToken(inputToken);
        setFee(fee);
      } else {
        setFeeToken(COINS.PRV);
        setFee(prvFee);
      }
    } catch (error) {
      console.debug('ERROR', error);
    }
  };
  React.useEffect(() => {
    if (inputToken && outputToken) {
      handleEstimateFee();
    }
  }, [inputToken, outputToken]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
