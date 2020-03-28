import React from 'react';
import PropTypes from 'prop-types';
import OptionMenu from '../OptionMenu';
import { View, Text } from '../core';
import { priceChartStyle } from './style';

const PriceChartSelector = ({ pairs, currentPair, onPress }) => {
  if (!pairs || pairs?.length === 0) return null;

  return (
    <OptionMenu
      data={pairs?.map(pair => ({
        id: pair,
        label: pair,
        handlePress: onPress
      }))}
      toggleStyle={priceChartStyle.textContainer}
      icon={(
        <View style={priceChartStyle.textContainer}>
          <Text numberOfLines={1} style={priceChartStyle.title}>{currentPair}</Text>
        </View>
      )}
    />
  );
};

PriceChartSelector.propTypes = {
  pairs: PropTypes.arrayOf(PropTypes.string).isRequired,
  onPress: PropTypes.func.isRequired,
  currentPair: PropTypes.string.isRequired
};

export default PriceChartSelector;
