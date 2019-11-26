import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Text,
  View,
} from '@src/components/core';
import formatUtil from '@utils/format';
import style from './style';

class PoolSize extends React.Component {
  render() {
    const {
      inputToken,
      outputToken,
      pair,
    } = this.props;

    if (!inputToken || !outputToken || _.isEmpty(pair)) {
      return null;
    }

    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];

    const formattedInputPool = formatUtil.amountFull(inputPool, inputToken.pDecimals);
    const formattedOutputPool = formatUtil.amountFull(outputPool, outputToken.pDecimals);
    return (
      <View style={style.twoColumns}>
        <Text style={[style.feeTitle]}>Current Pool Size:</Text>
        <View style={[style.flex, style.textRight]}>
          <Text style={style.fee} numberOfLines={1}>
            {formattedInputPool} {inputToken.symbol}
          </Text>
          <Text style={style.fee}>+</Text>
          <Text style={style.fee} numberOfLines={1}>
            {formattedOutputPool} {outputToken.symbol}
          </Text>
        </View>
      </View>
    );
  }
}

PoolSize.propTypes = {
  inputToken: PropTypes.object.isRequired,
  outputToken: PropTypes.object.isRequired,
  pair: PropTypes.object.isRequired,
};

export default PoolSize;
