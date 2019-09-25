import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Unicorn, PRV } from '../Icons';
import {TOP_BAR_HEIGHT} from '../../constants';
import Token from '../Icons/Token';

function TopBar(props) {
  const { account, playerTokens, onSell, onShowNotification } = props;
  const { value } = account;

  let displayValue = (value || 0) / 1e9;

  if (displayValue >= 1e9) {
    displayValue = _.round((displayValue / 1e9), 0) + 'M';
  } else if (displayValue >= 1e6) {
    displayValue = _.round((displayValue / 1e6), 0) + 'M';
  } else if (displayValue >= 1e4) {
    displayValue = _.round((displayValue / 1e3), 1) + 'K';
  } else {
    displayValue = _.round(displayValue, 2).toLocaleString();
  }

  const total = playerTokens.reduce((total, token) => {
    return total + Math.min(token.number, token.actualNumber || 0);
  }, 0);

  return (
    <View style={styles.main}>
      <View style={[styles.button]}>
        <TouchableOpacity style={styles.button} onPress={onShowNotification}>
          <PRV />
          <Text
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayValue}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Unicorn />
      </View>
      <View style={[styles.button]}>
        <TouchableOpacity style={styles.button} onPress={onSell}>
          <Token />
          <Text
            style={styles.text}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {total}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    justifyContent: 'center',
    height: TOP_BAR_HEIGHT,
    backgroundColor: '#A9F3F6',
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    width: 122,
    height: 32,
    margin: 15,
    borderRadius: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginLeft: 30,
    fontWeight: 'bold',
    color: '#7A5E17',
  },
});

TopBar.propTypes = {
  account: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.number,
  }).isRequired,
  playerTokens: PropTypes.arrayOf(PropTypes.shape({

  })).isRequired,
  onSell: PropTypes.func.isRequired,
  onShowNotification: PropTypes.func.isRequired,
};

export default TopBar;
