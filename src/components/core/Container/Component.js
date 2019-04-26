import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styleSheet from './style';

const Container = ({ style, ...props }) => (
  <View style={[styleSheet.container, style]} {...props} />
);

Container.propTypes = {
  style: PropTypes.object
};

export default Container;