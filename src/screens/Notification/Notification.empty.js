import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import srcEmpty from '@src/assets/images/icons/empty_notification.png';
import {FONT, COLORS} from '@src/styles';

const styled = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.lightGrey5,
  },
  icon: {
    width: 152,
    height: 156,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.lightGrey1,
    marginTop: 30,
  },
});

const Empty = props => {
  return (
    <View style={styled.container}>
      <Image source={srcEmpty} style={styled.icon} />
      <Text style={styled.title}>No notification</Text>
    </View>
  );
};

Empty.propTypes = {};

export default React.memo(Empty);
