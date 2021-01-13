import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Balance from '@screens/DexV2/components/Balance';
import ExchangeRate from '@screens/DexV2/components/ExchangeRate/ExchangeRateImpact';
import PriceImpact from '@screens/DexV2/components/PriceImpact/PriceImpact';
import styles from '@screens/DexV2/components/Trade/style';
import PDexFee from '@screens/DexV2/components/PDexFee';
import MultiplePoolSize from '@screens/DexV2/components/Trade/Components/MultiplePoolSize/MultiplePoolSize';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';

const TradeInfoSimple = ({ inputBalance, showPriceImpact }) => {
  const {
    inputToken,
    inputValue,

    outputToken,
    minimumAmount,

    feeToken,
  } = useSelector(tradeSelector);


  if (!inputToken || !outputToken) return null;

  return (
    <>
      <Balance
        title='Balance'
        token={inputToken}
        balance={inputBalance}
      />
      <ExchangeRate
        inputValue={inputValue}
        minimumAmount={minimumAmount}
        inputToken={inputToken}
        outputToken={outputToken}
      />
      {showPriceImpact && (
        <PriceImpact
          inputValue={inputValue}
          minimumAmount={minimumAmount}
          inputToken={inputToken}
          outputToken={outputToken}
        />
      )}
      <PDexFee
        feeToken={feeToken}
        leftStyle={styles.textLeft}
      />
      <MultiplePoolSize />
    </>
  );
};

TradeInfoSimple.propTypes = {
  showPriceImpact: PropTypes.bool,
  inputBalance: PropTypes.number,
};

TradeInfoSimple.defaultProps = {
  inputBalance: null,
  showPriceImpact: true
};

export default memo(TradeInfoSimple);