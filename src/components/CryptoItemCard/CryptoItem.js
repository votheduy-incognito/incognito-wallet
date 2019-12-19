import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableScale, ActivityIndicator } from '@src/components/core';
import CryptoIcon from '@src/components/CryptoIcon';
import formatUtil from '@src/utils/format';
import cryptoItemStyle from './style';

const CryptoItem = ({ fullName, name, amount, onPress, symbol, isGettingBalance, style, pDecimals, tokenId, rightComponent }) => (
  <TouchableScale style={[cryptoItemStyle.container, style]} onPress={amount != null ? onPress : null}>
    <View style={cryptoItemStyle.logoContainer}>
      <CryptoIcon tokenId={tokenId} />
    </View>
    <View style={cryptoItemStyle.cryptoNameContainer}>
      <Text style={cryptoItemStyle.mainNameText} numberOfLines={1} ellipsizeMode="tail">{fullName}</Text>
      <Text style={cryptoItemStyle.subNameText} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
    </View>
    <View style={cryptoItemStyle.rightContainer}>
      {
        rightComponent ?
          rightComponent
          : (
            isGettingBalance ?
              <ActivityIndicator size="small" /> : (
                amount != null ?
                  <Text style={cryptoItemStyle.amountText} numberOfLines={1} ellipsizeMode="tail">{formatUtil.amount(amount, pDecimals)} {symbol}</Text> :
                  <Text style={cryptoItemStyle.getAmountFailedText}>---</Text>
              )
          )
      }
    </View>
  </TouchableScale>
);

CryptoItem.defaultProps = {
  fullName: 'Sample name',
  name: 'Name',
  amount: 0,
  onPress: null,
  symbol: null,
  isGettingBalance: false,
  style: null,
  pDecimals: null,
  tokenId: null,
  rightComponent: null
};

CryptoItem.propTypes = {
  pDecimals: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  fullName: PropTypes.string,
  name: PropTypes.string,
  amount: PropTypes.number,
  onPress: PropTypes.func,
  symbol: PropTypes.string,
  isGettingBalance: PropTypes.bool,
  style: PropTypes.object,
  tokenId: PropTypes.string,
  rightComponent: PropTypes.node
};

export default CryptoItem;
