import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { View, Text, Button } from '@components/core';
import formatUtils from '@utils/format';
import {TRANSFER_STATUS} from '@src/redux/actions/dex';
import FullScreenLoading from '@components/FullScreenLoading/index';
import stylesheet from './style';

const DexHistory = ({
  amount,
  pDecimals,
  account,
  tokenSymbol,
  status,
  time,
  networkFee,
  networkFeeUnit,
  networkFeeDecimals,
  onContinue,
  loading,
}) => (
  <View style={stylesheet.wrapper}>
    <Text style={stylesheet.title} numberOfLines={1}>
      Withdraw {formatUtils.amountFull(amount, pDecimals)} {tokenSymbol} to {account}
    </Text>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TYPE</Text>
      <Text style={stylesheet.textRight}>Withdraw</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TIME</Text>
      <Text style={stylesheet.textRight}>{moment(time).format('DD MMM YYYY hh:mm A')}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>STATUS</Text>
      <Text style={[stylesheet.textRight, stylesheet[status]]}>
        {status === TRANSFER_STATUS.INTERRUPTED ? 'Paused' : _.capitalize(status) }
      </Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>AMOUNT</Text>
      <Text style={stylesheet.textRight}>{formatUtils.amountFull(amount, pDecimals)} {tokenSymbol}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>NETWORK FEE</Text>
      <Text style={stylesheet.textRight}>{formatUtils.amountFull(networkFee, networkFeeDecimals)} {networkFeeUnit}</Text>
    </View>
    <View style={stylesheet.row}>
      <Text style={stylesheet.field}>TO</Text>
      <Text style={stylesheet.textRight}>{account}</Text>
    </View>
    {status === TRANSFER_STATUS.INTERRUPTED && <Button style={stylesheet.button} title="Try again" onPress={onContinue} />}
    <FullScreenLoading
      open={loading}
      mainText={'Withdrawing your funds...\n\nThis may take a couple of minutes. Please do not navigate away from the app.'}
    />
  </View>
);

DexHistory.defaultProps = {
  status: '',
  loading: false,
};

DexHistory.propTypes = {
  tokenSymbol: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  pDecimals: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  networkFee: PropTypes.number.isRequired,
  networkFeeUnit: PropTypes.string.isRequired,
  networkFeeDecimals: PropTypes.number.isRequired,
  onContinue: PropTypes.func.isRequired,
  time: PropTypes.number.isRequired,
  loading: PropTypes.bool,
  status: PropTypes.string,
};

export default DexHistory;
