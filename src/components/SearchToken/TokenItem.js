import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CryptoIcon from '@components/CryptoIcon/index';
import checkboxChecked from '@src/assets/images/icons/ic_blue_check.png';
import plusRoundIcon from '@src/assets/images/icons/ic_plus_round.png';
import { COLORS } from '@src/styles';
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from '../core';
import { itemStyle } from './styles';

class TokenItem extends Component {

  _handlePress = () => {
    const { onPress, token } = this.props;
    if (typeof onPress === 'function') {
      onPress(token.tokenId);
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
    const { token, selected, divider, isProcessing } = this.props;
    
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
        <View style={itemStyle.checkboxWrapper}>
          { isProcessing
            ? <ActivityIndicator />
            : (
              <TouchableOpacity onPress={selected ? null : this._handlePress}>
                <Image style={itemStyle.checkbox} source={selected ? checkboxChecked : plusRoundIcon} />
              </TouchableOpacity>
            )
          }
          
        </View>
      </View>
    );
  }
}

TokenItem.defaultProps = {
  onPress: null,
  selected: false,
  divider: false,
  isProcessing: false
};

TokenItem.propTypes = {
  selected: PropTypes.bool,
  divider: PropTypes.bool,
  onPress: PropTypes.func,
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
