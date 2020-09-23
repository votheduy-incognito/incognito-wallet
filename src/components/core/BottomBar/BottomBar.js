import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { Icon } from 'react-native-elements';
import { COLORS, FONT } from '@src/styles';
import { hasNotch } from 'react-native-device-info';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    paddingVertical: 5,
    marginBottom: hasNotch() ? 30 : 0,
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 15,
    fontFamily: FONT.NAME.medium,
  },
});

const BottomBar = (props) => {
  const { onPress, text } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styled.container}>
        <Text style={styled.text}>{text}</Text>
        <Icon name="chevron-right" color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

BottomBar.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default React.memo(BottomBar);
