import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text,  } from '../core';
import { itemStyle } from './styles';

class TokenItem extends PureComponent {

  _handlePress = () => {
    const { onPress, token } = this.props;
    if (typeof onPress === 'function') {
      onPress(token.tokenId);
    }
  }

  render() {
    const { token, selected, divider } = this.props;

    if (!token) return null;

    return (
      <TouchableOpacity onPress={this._handlePress} style={[ itemStyle.container, divider && itemStyle.divider ]}>
        <View>
          <Text style={selected && itemStyle.highlight}>{token.name} ({token.symbol})</Text>
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