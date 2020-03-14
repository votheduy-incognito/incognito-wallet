import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {FONT, COLORS} from '@src/styles';
import {DeleteIcon} from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.red,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 4,
    color: COLORS.white,
    marginTop: 6
  },
});

const BtnDelete = props => {
  return (
    <TouchableOpacity {...props}>
      <View style={styled.container}>
        <DeleteIcon />
        <Text style={styled.title}>Delete</Text>
      </View>
    </TouchableOpacity>
  );
};

BtnDelete.propTypes = {};

export default BtnDelete;
