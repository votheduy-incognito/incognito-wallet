import React from 'react';
import { View, Button } from 'react-native';
import PropTypes from 'prop-types';

const HamburgerHeader = ({ onPress }) => (
  <View>
    <Button title='Menu' onPress={onPress} />
  </View>
);

HamburgerHeader.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default HamburgerHeader;