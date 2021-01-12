import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { View, Text, ScrollView, FlexView } from '@components/core';
import { withLayout_2 } from '@components/Layout';
import Header from '@components/Header/index';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { CONSTANT_COMMONS } from '@src/constants';
import HuntQRCode from '@components/HuntQRCode/HuntQRCode';
import { HISTORY_STATUS } from '@src/constants/trading';
import BigNumber from 'bignumber.js';
import formatUtils from '@utils/format';
import styles from './style';
import withData from './data.enhance';

const HistoryDetail = ({ history }) => {
  const buyAmount = history?.status === HISTORY_STATUS.SUCCESSFUL
  && history?.amountReceive
    ? history?.amountReceive
    : history?.buyAmount;

  const priceRate = formatUtils
    .fixedNumber(new BigNumber(buyAmount)
      .dividedBy(BigNumber(history.sellAmount))
      .toNumber(), 9);

  let factories = [
    {
      left: 'ID',
      right: history?.id,
    },
    {
      left: 'Buy',
      right: `${buyAmount} ${history?.buyTokenSymbol}`,
    },
    {
      left: 'Sell',
      right: `${history?.sellAmount} ${history?.sellTokenSymbol}`,
    },
    {
      left: 'Fee',
      right: `${history?.networkFee} ${history?.networkFeeTokenSymbol}`,
    },
    {
      left: 'Time',
      right: history?.createdAt,
    },
    {
      left: 'Status',
      right: history?.status,
    },
    {
      left: 'Account',
      right: history?.account,
    },
    {
      left: 'Trading fee',
      right: history?.tradingFee,
      disabled: !history?.tradingFee,
    },
    {
      left: 'Exchange',
      right: history?.exchange,
    },
    !isNaN(priceRate) && {
      left: 'Price rate',
      right: priceRate,
    },
  ];
  factories = factories.map((item) => ({
    ...item,
    disabled: item?.disabled || false,
  }));
  return (
    <FlexView>
      <Header title="pDEX" />
      <View style={styles.historyItem}>
        <Text style={styles.buttonTitle}>{history?.type}</Text>
        <Text style={styles.content}>{history?.description}</Text>
      </View>
      <ScrollView paddingBottom>
        {factories.map(
          (item) => !item?.disabled && <ExtraInfo key={item?.left} {...item} />,
        )}
        <HuntQRCode code={CONSTANT_COMMONS.HISTORY.TYPE.SEND} />
      </ScrollView>
    </FlexView>
  );
};

HistoryDetail.propTypes = {
  history: PropTypes.object.isRequired,
};

HistoryDetail.defaultProps = {};

export default compose(
  withLayout_2,
  withData,
)(HistoryDetail);
