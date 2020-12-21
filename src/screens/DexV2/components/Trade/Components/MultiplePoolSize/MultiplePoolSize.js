import React, { memo } from 'react';
import PoolSize from '@screens/DexV2/components/PoolSize';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import {PowerTrade} from '@screens/DexV2/components/Powered';
import {useSelector} from 'react-redux';
import {tradeSelector} from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';

const MultiplePoolSize = () => {
  const {
    pair,
    quote,
    isErc20,
    outputToken,
    inputToken
  } = useSelector(tradeSelector);

  const renderPoolSize = () => {
    if (pair && (!quote || (quote && !!quote?.crossTrade))) {
      return (
        <PoolSize
          outputToken={outputToken}
          inputToken={inputToken}
          pair={pair}
          hasPower
          network={isErc20 && quote?.network ? quote?.network : 'Incognito'}
        />
      );
    }
    return (
      <ExtraInfo
        left={<PowerTrade network={isErc20 && quote?.network ? quote?.network : 'Incognito'} />}
        right=''
      />
    );
  };
  return (
    <>
      {renderPoolSize()}
    </>
  );
};

MultiplePoolSize.propTypes = {};


export default memo(MultiplePoolSize);