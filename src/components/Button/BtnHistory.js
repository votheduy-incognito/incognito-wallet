import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {HistoryIcon} from '@src/components/Icons';

const styled = StyleSheet.create({});

const BtnHistory = props => {
  return (
    <TouchableOpacity {...props}>
      <HistoryIcon />
    </TouchableOpacity>
  );
};

BtnHistory.propTypes = {};

export default BtnHistory;
