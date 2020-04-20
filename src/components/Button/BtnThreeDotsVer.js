import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ThreeDotsVerIcon} from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    padding: 10,
  },
});

const BtnThreeDotsVer = props => {
  return (
    <TouchableOpacity {...props}>
      <View style={styled.container}>
        <ThreeDotsVerIcon />
      </View>
    </TouchableOpacity>
  );
};

BtnThreeDotsVer.propTypes = {};

export default BtnThreeDotsVer;
