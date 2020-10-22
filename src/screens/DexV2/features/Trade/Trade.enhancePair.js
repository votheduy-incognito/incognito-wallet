import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { COINS } from '@src/constants';
import { useSelector, useDispatch } from 'react-redux';
import { pairsDataSelectors } from '@screens/DexV2/features/Pairs';
import { tradeSelector } from './Trade.selector';
import { actionSetPair } from './Trade.actions';

const enhance = (WrappedComp) => (props) => {
  const { pairs } = useSelector(pairsDataSelectors);
  const { inputToken, outputToken, isErc20 } = useSelector(tradeSelector);
  const dispatch = useDispatch();
  const setPair = (payload) => dispatch(actionSetPair(payload));
  React.useEffect(() => {
    if (inputToken && outputToken && !isErc20) {
      if (inputToken.id === COINS.PRV_ID || outputToken.id === COINS.PRV_ID) {
        const pair = pairs.find(
          (item) =>
            item.keys.includes(inputToken.id) &&
            item.keys.includes(outputToken.id),
        );
        setPair([pair]);
      } else {
        const inPair = pairs.find(
          (item) =>
            item.keys.includes(inputToken.id) &&
            item.keys.includes(COINS.PRV_ID),
        );
        const outPair = pairs.find(
          (item) =>
            item.keys.includes(outputToken.id) &&
            item.keys.includes(COINS.PRV_ID),
        );

        if (inPair && outPair) {
          setPair([inPair, outPair]);
        } else {
          setPair(null);
        }
      }
    } else {
      setPair(null);
    }
  }, [inputToken, outputToken, pairs, isErc20]);

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
