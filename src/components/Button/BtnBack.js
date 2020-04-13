import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {BackIcon} from '@src/components/Icons';

const styled = StyleSheet.create({});

const BtnBack = props => {
  return (
    <TouchableOpacity {...props}>
      <BackIcon />
    </TouchableOpacity>
  );
};

BtnBack.propTypes = {};

export default BtnBack;
