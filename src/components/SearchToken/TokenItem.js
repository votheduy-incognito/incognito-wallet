import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CryptoIcon from '@components/CryptoIcon/index';
import icMinusRoundIcon from '@src/assets/images/icons/ic_minus_round.png';
import plusRoundIcon from '@src/assets/images/icons/ic_plus_round.png';
import { COLORS } from '@src/styles';
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from '../core';
import { itemStyle } from './styles';

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

  getNetworkName = (token) => {
    let name = 'Unknown';
    let color = COLORS.black;

    if (token?.isPrivateCoin) {
      name = `${token?.name} network`;
    } else if (token?.isERC20) {
      name = 'ERC20';
    } else if (token?.isBep2) {
      name = 'BEP2';
    } else if (token?.isIncognitoToken) {
      name = 'Incognito network';
      color = COLORS.lightGrey1;
    }

    return { name, color };
  };

  render() {
    const { token, divider, isProcessing } = this.props;
    
    if (!token) return null;

    const { name: networkName, color } = this.getNetworkName(token);

    return (
      <View style={[ itemStyle.container, divider && itemStyle.divider ]}>
        <View style={itemStyle.logoContainer}>
          <CryptoIcon tokenId={token.tokenId} onlyDefault={!this.hasIcon()} />
        </View>
        <View>
          <Text style={itemStyle.name}>{token.name}</Text>
          <View style={itemStyle.infoRow}>
            <Text style={[itemStyle.symbol]}>{token.symbol}</Text>
            <Text style={[itemStyle.networkName, { color }]}> - {networkName}</Text>
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
