import React from 'react';
import PropTypes from 'prop-types';
import {
  View, Text, StyleSheet, Image
} from 'react-native';
import priceUp from './img/price_up.png';
import priceDown from './img/price_down.png';

const LatestPrice = ({ price, diffPercent }) => (
  <View style={styles.container}>
    <View style={styles.label}><Text style={styles.textLabel}>Current price</Text></View>
    <View style={styles.priceContainer}>
      <Text style={styles.textPrice}>{price}</Text>
      <View style={styles.arrow}>
        <Text style={diffPercent >= 0 ? styles.arrowText : styles.arrowTextDown}>{diffPercent || '0.00000'}%</Text>
        <Image source={diffPercent >= 0 ? priceUp : priceDown} />
      </View>
    </View>
    <View style={styles.label}><Text style={styles.textLabel}>Liquidily pool</Text></View>
    <View style={styles.priceContainer}><Text style={styles.textPrice}>100,000$</Text></View>
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
    marginLeft: 10
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