import React, { Component } from 'react';
import PropTypes from 'prop-types';
import icMinusRoundIcon from '@src/assets/images/icons/ic_minus_round.png';
import plusRoundIcon from '@src/assets/images/icons/ic_plus_round.png';
import CryptoItemCard from '@src/components/CryptoItemCard';
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

  render() {
    const { token, isProcessing } = this.props;
    
    if (!token) return null;

    return (
      <CryptoItemCard
        key={token?.tokenId}
        tokenId={token?.tokenId}
        rightComponent={
          isProcessing
            ? <ActivityIndicator />
            : (
              <TouchableOpacity style={itemStyle.toggle} onPress={this._handlePress}>
                <Image style={itemStyle.toggleImg} source={token?.isFollowed ? icMinusRoundIcon : plusRoundIcon} />
              </TouchableOpacity>
            )
        }
      />
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
