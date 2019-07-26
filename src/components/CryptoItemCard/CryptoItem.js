import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from '@src/components/core';
import formatUtil from '@src/utils/format';
import cryptoItemStyle from './style';

const CryptoItem = ({ fullName, typeName, amount, icon, onPress, symbol, isGettingBalance, style }) => (
  <TouchableOpacity style={[cryptoItemStyle.container, style]} onPress={amount != null ? onPress : null}>
    <View style={cryptoItemStyle.logoContainer}>
      <Image source={icon} style={cryptoItemStyle.logo} />
    </View>
    <View style={cryptoItemStyle.cryptoNameContainer}>
      <Text style={cryptoItemStyle.mainNameText}>{fullName}</Text>
      <Text style={cryptoItemStyle.subNameText}>{typeName}</Text>
    </View>
    <View style={cryptoItemStyle.balanceContainer}>
      { isGettingBalance ? 
        <ActivityIndicator /> : (
          amount != null ?
            <Text style={cryptoItemStyle.amountText} numberOfLines={1} ellipsizeMode="tail">{formatUtil.amount(amount, symbol)} {symbol}</Text> :
            <Text style={cryptoItemStyle.getAmountFailedText}>Failed</Text>
        )
      }
    </View>
  </TouchableOpacity>
);

CryptoItem.defaultProps = {
  fullName: 'Sample name',
  typeName: 'Name',
  amount: 0,
  icon: null,
  onPress: null,
  symbol: null,
  isGettingBalance: false,
  style: null
};

CryptoItem.propTypes = {
  fullName: PropTypes.string,
  typeName: PropTypes.string,
  amount: PropTypes.number,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPress: PropTypes.func,
  symbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object
};

export default CryptoItem;