import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { View, Text } from '@components/core';
import HeaderBar from '@components/HeaderBar/HeaderBar';
import {COLORS} from '@src/styles';
import stylesheet from './style';

const options = {
  title: 'Transaction details',
  headerBackground: COLORS.dark2,
};

const DexHistoryDetail = ({ navigation }) => {
  const { params } = navigation.state;
  const { history } = params;
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    status,
    type,
    time,
    networkFee,
    networkFeeUnit,
    tradingFee,
    stopPrice,
  } = history;
  return(
    <View>
      <HeaderBar
        index={2}
        navigation={navigation}
        scene={{ descriptor: { options } }}
      />
      <View style={stylesheet.wrapper}>
        <Text style={stylesheet.title}>
          {type === 'trade' ? `Trade ${inputToken} for ${outputToken}` : ''}
        </Text>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>TYPE</Text>
          <Text style={stylesheet.textRight}>{_.capitalize(type || 'Trade')}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>TIME</Text>
          <Text style={stylesheet.textRight}>{moment(time).format('DD MMM YYYY hh:mm A')}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>STATUS</Text>
          <Text style={[stylesheet.textRight, stylesheet[status]]}>{_.capitalize(status)}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>YOU PAID</Text>
          <Text style={stylesheet.textRight}>{inputValue} {inputToken}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>YOU GET (ESTIMATED)</Text>
          <Text style={stylesheet.textRight}>{outputValue} {outputToken}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>NETWORK FEE</Text>
          <Text style={stylesheet.textRight}>{networkFee} {networkFeeUnit}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>TRADING FEE</Text>
          <Text style={stylesheet.textRight}>{tradingFee} {inputToken}</Text>
        </View>
        <View style={stylesheet.row}>
          <Text style={stylesheet.field}>MINIMUM AMOUNT</Text>
          <Text style={stylesheet.textRight}>{stopPrice} {outputToken}</Text>
        </View>
      </View>
    </View>
  );
};

DexHistoryDetail.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        history: PropTypes.shape({
          inputToken: PropTypes.string.isRequired,
          inputValue: PropTypes.string.isRequired,
          outputToken: PropTypes.string.isRequired,
          outputValue: PropTypes.string.isRequired,
          onPress: PropTypes.func.isRequired,
          type: PropTypes.string.isRequired,
          time: PropTypes.number.isRequired,
          status: PropTypes.string,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default DexHistoryDetail;
