import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView as RNComponent } from 'react-native';
import styleSheet from './style';

const ScrollView = ({ style, ...otherProps }) => (<RNComponent style={[styleSheet.root, style]} {...otherProps} />);

ScrollView.defaultProps = {
  style: null
};

ScrollView.propTypes = {
  style: PropTypes.object
};

export default ScrollView;