import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {FONT, COLORS} from '@src/styles';
import {EditIcon} from '@src/components/Icons';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGrey1,
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

const BtnEdit = props => {
  return (
    <TouchableOpacity {...props}>
      <View style={styled.container}>
        <EditIcon />
        <Text style={styled.title}>Edit</Text>
      </View>
    </TouchableOpacity>
  );
};

BtnEdit.propTypes = {};

export default BtnEdit;
