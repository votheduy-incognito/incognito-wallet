import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CryptoIcon from '@components/CryptoIcon/index';
import icMinusRoundIcon from '@src/assets/images/icons/ic_minus_round.png';
import plusRoundIcon from '@src/assets/images/icons/ic_plus_round.png';
import { COLORS } from '@src/styles';
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from '../core';
import { itemStyle } from './styles';

export const NETWORK_NAME_ID = {
  BEP2: 'BEP2',
  ERC20: 'ERC20',
  INCOGNITO: 'INCOGNITO',
  USE_COIN_NAME: 'USE_COIN_NAME',
};

class TokenItem extends Component {

  _handlePress = () => {
    const { onFollowToken, onUnFollowToken, token } = this.props;
    if (token?.isFollowed) {
      if (typeof onUnFollowToken === 'function') {
        onUnFollowToken(token.tokenId);
      }
    } else {
      if (typeof onFollowToken === 'function') {
        onFollowToken(token.tokenId);
      }
    }
  };

  hasIcon = () => {
    const { token } = this.props;
    if (token?.isPrivateToken || token?.isPrivateCoin) {
      return true;
    }

    return false;
  }

  getNetworkNameColor = (token) => {
    let color = COLORS.black;

    switch(token?.networkNameId) {
    case NETWORK_NAME_ID.USE_COIN_NAME:
    case NETWORK_NAME_ID.ERC20:
    case NETWORK_NAME_ID.BEP2:
      break;

    case NETWORK_NAME_ID.INCOGNITO:
      color = COLORS.lightGrey1;
    }

    return color;
  };

  render() {
    const { token, divider, isProcessing } = this.props;
    
    if (!token) return null;

    const color = this.getNetworkNameColor(token);

    return (
      <View style={[ itemStyle.container, divider && itemStyle.divider ]}>
        <View style={itemStyle.logoContainer}>
          <CryptoIcon tokenId={token.tokenId} onlyDefault={!this.hasIcon()} />
        </View>
        <View style={itemStyle.infoContainer}>
          <Text style={itemStyle.name} numberOfLines={1} ellipsizeMode='tail'>{token.name}</Text>
          <View style={itemStyle.infoRow}>
            <Text style={[itemStyle.symbol]}>{token.symbol}</Text>
            <Text style={[itemStyle.networkName, { color }]}> - {token?.networkName}</Text>
          </View>
        </View>
        <View style={itemStyle.toggleWrapper}>
          { isProcessing
            ? <ActivityIndicator />
            : (
              <TouchableOpacity style={itemStyle.toggle} onPress={this._handlePress}>
                <Image style={itemStyle.toggleImg} source={token?.isFollowed ? icMinusRoundIcon : plusRoundIcon} />
              </TouchableOpacity>
            )
          }
          
        </View>
      </View>
    );
  }
}

TokenItem.defaultProps = {
  onFollowToken: null,
  onUnFollowToken: null,
  divider: false,
  isProcessing: false
};

TokenItem.propTypes = {
  divider: PropTypes.bool,
  onFollowToken: PropTypes.func,
  onUnFollowToken: PropTypes.func,
  isProcessing: PropTypes.bool,
  token: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    pSymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    networkName: PropTypes.string.isRequired,
  }).isRequired
};

export default TokenItem;
