import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from '@src/components/core';
import formatUtil from '@src/utils/format';
import cryptoItemStyle from './style';

const CryptoItem = ({ fullName, name, amount, icon, onPress, symbol, isGettingBalance, style, pDecimals }) => (
  <TouchableOpacity style={[cryptoItemStyle.container, style]} onPress={amount != null ? onPress : null}>
    <View style={cryptoItemStyle.logoContainer}>
      <Image source={icon} style={cryptoItemStyle.logo} />
    </View>
    <View style={cryptoItemStyle.cryptoNameContainer}>
      <Text style={cryptoItemStyle.mainNameText}>{fullName}</Text>
      <Text style={cryptoItemStyle.subNameText}>{name}</Text>
    </View>
    <View style={cryptoItemStyle.balanceContainer}>
      { isGettingBalance ? 
        <ActivityIndicator /> : (
          amount != null ?
            <Text style={cryptoItemStyle.amountText} numberOfLines={1} ellipsizeMode="tail">{formatUtil.amount(amount, pDecimals)} {symbol}</Text> :
            <Text style={cryptoItemStyle.getAmountFailedText}>Failed</Text>
        )
      }
    </View>
  </TouchableOpacity>
);

CryptoItem.defaultProps = {
  fullName: 'Sample name',
  name: 'Name',
  amount: 0,
  icon: null,
  onPress: null,
  symbol: null,
  isGettingBalance: false,
  style: null,
  pDecimals: null,
};

CryptoItem.propTypes = {
  pDecimals: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  fullName: PropTypes.string,
  name: PropTypes.string,
  amount: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
  symbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object
};

export default CryptoItem;