import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableScale, ActivityIndicator } from '@src/components/core';
import CryptoIcon from '@src/components/CryptoIcon';
import formatUtil from '@src/utils/format';
import VerifiedText from '@src/components/VerifiedText';
import cryptoItemStyle from './style';

const CryptoItem = ({ fullName, name, amount, onPress, symbol, isGettingBalance, style, pDecimals, tokenId, rightComponent, isVerified }) => (
  <TouchableScale style={[cryptoItemStyle.container, style]} onPress={amount != null ? onPress : null}>
    <View style={cryptoItemStyle.logoContainer}>
      <CryptoIcon tokenId={tokenId} />
    </View>
    <View style={cryptoItemStyle.cryptoNameContainer}>
      <VerifiedText text={fullName} numberOfLines={1} ellipsizeMode="tail" style={cryptoItemStyle.mainNameText} isVerified={isVerified} />
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
  rightComponent: null,
  isVerified: false
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
  rightComponent: PropTypes.node,
  isVerified: PropTypes.bool,
};

export default CryptoItem;
