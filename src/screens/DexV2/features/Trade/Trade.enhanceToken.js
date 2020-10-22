import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { pairsSelector } from '@screens/DexV2/features/Pairs';
import { COINS } from '@src/constants';
import { tradeSelector } from './Trade.selector';
import {
  actionSetInputToken,
  actionSetOutputList,
  actionSetOutputToken,
} from './Trade.actions';

const enhance = (WrappedComp) => (props) => {
  const { pairTokens, pairs } = useSelector(pairsSelector)?.data;
  const { inputToken, outputToken } = useSelector(tradeSelector);
  const dispatch = useDispatch();
  const handleSetInputToken = () => {
    try {
      const payload = _.head(pairTokens);
      dispatch(actionSetInputToken(payload));
    } catch (error) {
      console.debug('ERROR');
    }
  };
  const handleSetOutputToken = () => {
    try {
      let newOutputToken = outputToken;
      let outputList = [];
      if (pairs.find((pair) => pair.keys.includes(inputToken.id))) {
        outputList = pairs
          .map((pair) => {
            const { keys } = pair;

            if (
              inputToken.id === COINS.PRV_ID ||
              !keys.includes(inputToken.id)
            ) {
              const id = pair.keys.find((key) => key !== COINS.PRV_ID);
              return pairTokens.find((token) => token.id === id);
            }

            return null;
          })
          .filter((item) => item && item.name && item.symbol);
        const prvToken = pairTokens.find((token) => token.id === COINS.PRV_ID);
        if (inputToken.id !== COINS.PRV_ID && !outputList.includes(prvToken)) {
          outputList.push(prvToken);
        }
      }
      if (inputToken.address) {
        outputList = outputList.concat(
          pairTokens.filter(
            (token) => token.address && token.id !== inputToken.id,
          ),
        );
      }
      outputList = _(outputList)
        .orderBy(
          [
            'priority',
            'hasIcon',
            (item) => item.symbol && item.symbol.toLowerCase(),
          ],
          ['asc', 'desc', 'desc', 'asc'],
        )
        .uniqBy((item) => item.id)
        .value();

      if (
        outputToken &&
        !outputList.find((item) => item.id === outputToken.id)
      ) {
        newOutputToken = null;
      }

      newOutputToken = newOutputToken || outputList[0];
      dispatch(actionSetOutputToken(newOutputToken));
      dispatch(actionSetOutputList(outputList));
    } catch (error) {
      console.debug('ERROR');
    }
  };
  React.useEffect(() => {
    if (!_.isEmpty(pairTokens) && !inputToken) {
      handleSetInputToken();
    }
  }, [pairTokens]);

  React.useEffect(() => {
    if (inputToken) {
      handleSetOutputToken();
    }
  }, [inputToken, pairs]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
