import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { View, Text } from '@components/core';
import TransactionID from './TransactionID';
import stylesheet from './style';

const DepositHistory = ({
  txId,
  amount,
  account,
  tokenSymbol,
  status,
  time,
  networkFee,
  networkFeeUnit,
}) => (
  <View style={stylesheet.wrapper}>
    <Text numberOfLines={2} style={stylesheet.title}>
      Deposit {amount} {tokenSymbol} from {account}
    </Text>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TYPE</Text>
      <Text style={stylesheet.textRight}>Deposit</Text>
    </View>
    <TransactionID txId={txId} />
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TIME</Text>
      <Text style={stylesheet.textRight}>{moment(time).format('DD MMM YYYY hh:mm A')}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>STATUS</Text>
      <Text style={[stylesheet.textRight, stylesheet[status]]} numberOfLines={2}>{_.capitalize(status)}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>AMOUNT</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{amount} {tokenSymbol}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>NETWORK FEE</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{networkFee} {networkFeeUnit}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>FROM</Text>
      <Text style={stylesheet.textRight} numberOfLines={2}>{account}</Text>
    </View>
  </View>
);

DepositHistory.defaultProps = {
  status: ''
};

DepositHistory.propTypes = {
  txId: PropTypes.string.isRequired,
  tokenSymbol: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  networkFee: PropTypes.string.isRequired,
  networkFeeUnit: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  status: PropTypes.string,
};

export default DepositHistory;
