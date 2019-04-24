import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import Icons from 'react-native-vector-icons/MaterialIcons';

const HamburgerHeader = ({ onPress }) => (
  <View>
    <Icons.Button
      name='menu'
      onPress={onPress}
    />
  </View>
);

HamburgerHeader.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default HamburgerHeader;