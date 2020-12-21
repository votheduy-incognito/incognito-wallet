import React, { memo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { tradeSelector, tradingFeeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import styles from '@screens/DexV2/components/TradeConfirm/style';
import {Text} from '@components/core';
import Help from '@components/Help';
import format from '@utils/format';
import { COINS, TRADING } from '@src/constants';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';

const FeeViewTradeConfirm = () => {
  const {
    isERC20,
    fee,
    feeToken,
    quote
  } = useSelector(tradeSelector);

  const {
    tradingFee
  } = useSelector(tradingFeeSelector)();

  const renderTradingFee = () => {
    const isKyper = quote && quote?.network && quote?.network !== TRADING.ERC20_NETWORK.PDex;
    const title   = isKyper ? 'Cross-chain fee' : 'Priority fee';
    const content = isKyper ?
      `This is a ${quote?.network} pool. You are trading anonymously on the Ethereum network which will incur cross-chain fees.` :
      'You have chosen to boost this trade.';
    return (
      <ExtraInfo
        token={feeToken}
        left={(
          <View style={styles.row}>
            <Text style={[styles.extra, styles.extraMedium]}>{title}</Text>
            <Help
              title={title}
              content={content}
            />
          </View>
        )}
        right={`${format.amount(tradingFee, COINS.PRV.pDecimals)} ${
          feeToken.symbol
        }`}
        style={styles.extra}
      />
    );
  };

  const renderNetworkFee = () => {
    const content = isERC20
      ? 'Network fees go to validators.'
      : 'Network fees go to validators. There is no trading fee.';
    const title   = 'Network fee';
    return (
      <ExtraInfo
        token={feeToken}
        left={(
          <View style={styles.row}>
            <Text style={[styles.extra, styles.extraMedium]}>Network fee</Text>
            <Help
              title={title}
              content={content}
            />
          </View>
        )}
        right={`${format.amount(fee, feeToken.pDecimals)} ${feeToken.symbol}`}
        style={styles.extra}
      />
    );
  };

  return (
    <View>
      {!!tradingFee && renderTradingFee()}
      {renderNetworkFee()}
    </View>
  );
};

FeeViewTradeConfirm.propTypes = {};


export default memo(FeeViewTradeConfirm);