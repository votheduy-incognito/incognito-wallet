import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/MaterialIcons';
import styleSheet from './style';

const HamburgerHeader = ({ onPress }) => (
  <View>
    <Icons.Button
      style={styleSheet.container}
      name='menu'
      size={25}
      onPress={onPress}
    />
  </View>
);

HamburgerHeader.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default HamburgerHeader;