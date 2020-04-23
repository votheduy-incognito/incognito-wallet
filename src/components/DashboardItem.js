import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
} from '@src/components/core';
import {COLORS, FONT} from '@src/styles';

const DashboardItem = ({ title, text }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingLeft: 20
  },
  title: {
    color: COLORS.lightGrey1,
    ...FONT.STYLE.medium,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 12,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
  },
});

DashboardItem.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default DashboardItem;
