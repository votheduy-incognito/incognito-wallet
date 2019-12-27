import React, { Component } from 'react';
import PropTypes from 'prop-types';
import icMinusRoundIcon from '@src/assets/images/icons/ic_minus_round.png';
import plusRoundIcon from '@src/assets/images/icons/ic_plus_round.png';
import CryptoItemCard from '@src/components/CryptoItemCard';
import { TouchableOpacity, Image, View, ActivityIndicator } from '../core';
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

  handleShowTokenInfo = (selectedPrivacy) => {
    const { onPress } = this.props;
    if (typeof onPress === 'function') {
      onPress(selectedPrivacy);
    }
  }

  render() {
    const { token, isProcessing } = this.props;
    
    if (!token) return null;

    return (
      <CryptoItemCard
        key={token?.tokenId}
        tokenId={token?.tokenId}
        onPress={this.handleShowTokenInfo}
        rightComponent={(
          <View style={itemStyle.rightComponentContainer}>
            {
              isProcessing
                ? <ActivityIndicator />
                : (
                  <TouchableOpacity style={itemStyle.toggle} onPress={this._handlePress}>
                    <Image style={itemStyle.toggleImg} source={token?.isFollowed ? icMinusRoundIcon : plusRoundIcon} />
                  </TouchableOpacity>
                )
            }
          </View>
        )}
      />
    );
  }
}

TokenItem.defaultProps = {
  onFollowToken: null,
  onUnFollowToken: null,
  onPress: null,
  isProcessing: false
};

TokenItem.propTypes = {
  onFollowToken: PropTypes.func,
  onUnFollowToken: PropTypes.func,
  isProcessing: PropTypes.bool,
  onPress: PropTypes.func,
  token: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
  }).isRequired
};

export default TokenItem;
