import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {COLORS, FONT} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  max: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    color: COLORS.primary,
  },
});

const BtnMax = props => {
  return (
    <TouchableOpacity {...props}>
      <View style={styled.container}>
        <Text style={styled.max}>Max</Text>
      </View>
    </TouchableOpacity>
  );
};

BtnMax.propTypes = {};

export default BtnMax;
