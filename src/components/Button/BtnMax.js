import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback, Text} from 'react-native';
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
    <TouchableWithoutFeedback {...props}>
      <View style={styled.container}>
        <Text style={styled.max}>Max</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

BtnMax.propTypes = {};

export default BtnMax;
