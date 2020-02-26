import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView as RNComponent} from 'react-native';
import styleSheet from './style';

const ScrollView = React.forwardRef(({style, ...otherProps}, ref) => (
  <RNComponent
    style={[styleSheet.root, style]}
    keyboardShouldPersistTaps="handled"
    {...otherProps}
    ref={ref}
    showsVerticalScrollIndicator={false}
  />
));

ScrollView.defaultProps = {
  style: null,
};

ScrollView.propTypes = {
  style: PropTypes.object,
};

export default ScrollView;
