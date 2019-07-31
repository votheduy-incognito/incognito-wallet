import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text } from '../core';
import { itemStyle } from './styles';

class PTokenItem extends PureComponent {

  _handlePress = () => {
    const { onPress, token } = this.props;
    if (typeof onPress === 'function') {
      onPress(token.tokenId);
    }
  }

  render() {
    const { token, selected } = this.props;

    if (!token) return null;

    return (
      <TouchableOpacity onPress={this._handlePress} style={[ selected && itemStyle.highlight ]}>
        <View>
          <Text>{token.name}</Text>
          <Text>{token.symbol} ({token.pSymbol})</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

PTokenItem.defaultProps = {
  onPress: null,
  selected: false,
};

PTokenItem.propTypes = {
  selected: PropTypes.bool,
  onPress: PropTypes.func,
  token: PropTypes.shape({
    tokenId: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    pSymbol: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired
};

export default PTokenItem;