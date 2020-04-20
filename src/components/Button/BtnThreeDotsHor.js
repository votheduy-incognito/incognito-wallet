import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ThreeDotsHorIcon} from '@src/components/Icons';

const styled = StyleSheet.create({});

const BtnThreeDotsHor = props => {
  return (
    <TouchableOpacity {...props}>
      <ThreeDotsHorIcon style={props?.style || {}} />
    </TouchableOpacity>
  );
};

BtnThreeDotsHor.propTypes = {};

export default BtnThreeDotsHor;
