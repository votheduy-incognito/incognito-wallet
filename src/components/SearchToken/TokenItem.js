import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CryptoIcon from '@components/CryptoIcon/index';
import { TOKEN_TYPES } from '@src/constants/tokenData';
import checkboxChecked from '@src/assets/images/checkbox_checked.png';
import checkboxUnchecked from '@src/assets/images/checkbox_unchecked.png';
import { TouchableOpacity, View, Text, Image } from '../core';
import { itemStyle } from './styles';

class TokenItem extends PureComponent {

  _handlePress = () => {
    const { onPress, token } = this.props;
    if (typeof onPress === 'function') {
      onPress(token.tokenId);
    }
  };

  hasIcon = () => {
    const { token } = this.props;
    if ([TOKEN_TYPES.COIN, TOKEN_TYPES.ERC20, TOKEN_TYPES.BEP2].includes(token?.type)) {
      return true;
    }

    return false;
  }

  render() {
    const { token, selected, divider } = this.props;

    if (!token) return null;

    return (
      <TouchableOpacity onPress={this._handlePress} style={[ itemStyle.container, divider && itemStyle.divider ]}>
        <View style={itemStyle.logoContainer}>
          <CryptoIcon symbol={token.symbol} onlyDefault={!this.hasIcon()} />
        </View>
        <View>
          <Text style={itemStyle.name}>{token.name}</Text>
          <Text style={itemStyle.symbol}>{token.symbol}</Text>
        </View>
        <View style={itemStyle.checkboxWrapper}>
          <Image style={itemStyle.checkbox} source={selected ? checkboxChecked : checkboxUnchecked} />
        </View>
      </TouchableOpacity>
    );
  }
}

TokenItem.defaultProps = {
  onPress: null,
  selected: false,
  divider: false,
};

TokenItem.propTypes = {
  selected: PropTypes.bool,
  divider: PropTypes.bool,
  onPress: PropTypes.func,
  token: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    pSymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired
};

export default TokenItem;
