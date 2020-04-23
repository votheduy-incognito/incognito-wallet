import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from '@src/components/core';
import {COLORS} from '@src/styles';
import priceUp from './img/price_up.png';
import priceDown from './img/price_down.png';

const LatestPrice = ({price, diffPercent, otherToken, onSwitchToken}) => (
  <View style={styles.container}>
    <View style={styles.label}><Text style={styles.textLabel}>Current price</Text></View>
    <View style={styles.priceContainer}>
      <Text style={styles.textPrice}>{price}</Text>
      { diffPercent !== 'NaN' && diffPercent ? (
        <View style={styles.arrow}>
          <Text style={diffPercent >= 0 ? styles.arrowText : styles.arrowTextDown}>{diffPercent || '0.00'}%</Text>
          <Image source={diffPercent >= 0 ? priceUp : priceDown} />
        </View>
      ) : null }
    </View>
    <TouchableOpacity onPress={onSwitchToken}>
      <Text style={styles.link}>View {otherToken} price</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingLeft: 20
  },
  label: {
    paddingTop: 20
  },
  textLabel: {
    color: '#B6B6B6',
    fontSize: 12,
    fontWeight: '500'
  },
  priceContainer: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  textPrice: {
    fontSize: 24,
    color: '#111111'
  },
  arrow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 10,
    marginBottom: 2,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
  },
  arrowText: {
    color: '#00A351'
  },
  arrowTextDown: {
    color: '#ED8C00'
  }
});

LatestPrice.propTypes = {
  price: PropTypes.string.isRequired,
  diffPercent: PropTypes.string.isRequired,
};

export default LatestPrice;
