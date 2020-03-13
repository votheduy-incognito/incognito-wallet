import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import srcEmpty from '@src/assets/images/icons/address_book_empty.png';
import {FONT, COLORS} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey6,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 10,
    color: COLORS.lightGrey1,
    textAlign: 'center',
    marginTop: 20,
  },
  imgEmpty: {
    width: 180,
    height: 160,
  },
});

const FrequentReceiversEmpty = () => {
  return (
    <View style={styled.container}>
      <Image style={styled.imgEmpty} source={srcEmpty} />
      <Text style={styled.title}>{'Your address book \nis currently empty'}</Text>
    </View>
  );
};

FrequentReceiversEmpty.propTypes = {};

export default React.memo(FrequentReceiversEmpty);
