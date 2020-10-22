import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  RoundCornerButton,
  ScrollView,
  FlexView,
} from '@components/core';
import Balance from '@screens/DexV2/components/Balance';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import format from '@utils/format';
import Header from '@components/Header/index';
import Loading from '@screens/DexV2/components/Loading';
import Help from '@components/Help/index';
import Powered from '@screens/DexV2/components/Powered';
import PoolSize from '@screens/DexV2/components/PoolSize';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/features/Trade';
import withTradeConfirm from './TradeConfirm.enhance';
import { styled as styles } from './TradeConfirm.styled';

const CrossTradeConfirm = React.memo(() => {
  const { pair, outputToken, inputToken } = useSelector(tradeSelector);
  return (
    <PoolSize outputToken={outputToken} inputToken={inputToken} pair={pair} />
  );
});

const ERC20TradeConfirm = React.memo(() => {
  const { feeToken, quote } = useSelector(tradeSelector);
  if (!quote?.erc20Fee) {
    return null;
  }
  return (
    <ExtraInfo
      token={feeToken}
      left={(
        <View style={styles.row}>
          <Text style={styles.extra}>Trading fee</Text>
          <Help
            title="Trading fee"
            content="This is a Kyber pool. You are trading anonymously on the Ethereum network which will incur trading fees. Incognito does not charge trading fees."
          />
        </View>
      )}
      right={`${format.amount(quote?.erc20Fee, feeToken?.pDecimals)} ${
        feeToken?.symbol
      }`}
      style={styles.extra}
    />
  );
});

const TradeConfirm = (props) => {
  const {
    inputToken,
    inputValue,
    inputText,
    outputToken,
    minimumAmount,
    warning,
    isErc20,
    network,
    feeToken,
    fee,
  } = useSelector(tradeSelector);
  const { onTrade, trading, error } = props;
  return (
    <FlexView>
      <Header title="Order preview" />
      <ScrollView paddingBottom>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>Buy at least</Text>
          <Text style={styles.bigText} numberOfLines={3}>
            {format.amountFull(minimumAmount, outputToken?.pDecimals)}{' '}
            {outputToken?.symbol}
          </Text>
        </View>
        <ExtraInfo
          left="Pay with"
          right={`${inputText} ${inputToken?.symbol}`}
          style={{ ...styles.extra, ...styles.bold }}
        />
        <Balance
          token={inputToken}
          balance={inputValue}
          title="Purchase"
          style={styles.extra}
        />
        <ExtraInfo
          token={feeToken}
          left={(
            <View style={styles.row}>
              <Text style={styles.extra}>Network fee</Text>
              <Help
                title="Network fee"
                content={`Network fees go to validators.${
                  isErc20 ? '' : 'There is no trading fee.'
                } `}
              />
            </View>
          )}
          right={`${format.amount(fee, feeToken?.pDecimals)} ${
            feeToken?.symbol
          }`}
          style={styles.extra}
        />
        {isErc20 ? <ERC20TradeConfirm /> : <CrossTradeConfirm />}
        <Powered network={network} />
        {!!warning && (
          <ExtraInfo left={warning} right="" style={styles.warning} />
        )}
        {!!error && <Text style={styles.error}>{error}</Text>}
        <RoundCornerButton
          style={styles.button}
          title="Confirm"
          onPress={onTrade}
          disabled={!!error}
        />
      </ScrollView>
      <Loading open={trading} />
    </FlexView>
  );
};

TradeConfirm.propTypes = {
  onTrade: PropTypes.func.isRequired,
  trading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
};

export default withTradeConfirm(React.memo(TradeConfirm));
