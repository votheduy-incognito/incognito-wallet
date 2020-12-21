import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
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
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import withWarning from '@screens/DexV2/components/Trade/warning.enhance';
import Loading from '@screens/DexV2/components/Loading';
import withAccount from '@screens/DexV2/components/account.enhance';
import Powered from '@screens/DexV2/components/Powered';
import PoolSize from '@screens/DexV2/components/PoolSize';
import FeeViewTradeConfirm from '@screens/DexV2/components/TradeConfirm/FeeViewTradeConfirm';
import withSuccess from './success.enhance';
import withTrade from './trade.enhance';
import withData from './data.enhance';
import styles from './style';

const Trade = ({
  inputToken,
  inputValue,
  inputText,
  outputToken,
  minimumAmount,
  onTrade,
  trading,
  error,
  warning,
  pair,
  quote,
  isErc20
}) => {

  const renderPoolSize = () => {
    if (isErc20 && !quote?.crossTrade) return null;
    return (
      <PoolSize
        outputToken={outputToken}
        inputToken={inputToken}
        pair={pair}
      />
    );
  };

  return (
    <FlexView>
      <Header title="Order preview" />
      <ScrollView paddingBottom>
        <View style={styles.mainInfo}>
          <Text style={styles.bigText}>Buy at least</Text>
          <Text style={styles.bigText} numberOfLines={3}>
            {format.amountFull(minimumAmount, outputToken.pDecimals)}{' '}
            {outputToken.symbol}
          </Text>
        </View>
        <ExtraInfo
          left="Pay with"
          right={`${inputText} ${inputToken.symbol}`}
          style={{ ...styles.extra, ...styles.bold }}
        />
        <Balance
          token={inputToken}
          balance={inputValue}
          title="Purchase"
          style={styles.extra}
        />
        <FeeViewTradeConfirm />
        {renderPoolSize()}
        <Powered network={quote?.network} />
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

Trade.propTypes = {
  inputToken: PropTypes.object,
  inputValue: PropTypes.number,
  inputText: PropTypes.string,
  onTrade: PropTypes.func.isRequired,
  outputToken: PropTypes.object,
  minimumAmount: PropTypes.number,

  trading: PropTypes.bool.isRequired,

  error: PropTypes.string,
  warning: PropTypes.string,
  isErc20: PropTypes.bool,
  pair: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  quote: PropTypes.object,

};

Trade.defaultProps = {
  inputToken: null,
  inputValue: null,
  inputText: '',
  outputToken: null,
  minimumAmount: null,
  error: '',
  warning: '',
  isErc20: false,
  pair: null,
  quote: null,
};

export default compose(
  withLayout_2,
  withData,
  withSuccess,
  withAccount,
  withTrade,
  withWarning,
)(Trade);
