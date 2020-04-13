import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ThreeDotsVerIcon} from '@src/components/Icons';

const styled = StyleSheet.create({});

const BtnThreeDotsVer = props => {
  return (
    <TouchableOpacity {...props}>
      <ThreeDotsVerIcon />
    </TouchableOpacity>
  );
};

BtnThreeDotsVer.propTypes = {};

export default BtnThreeDotsVer;
