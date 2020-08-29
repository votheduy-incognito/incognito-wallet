import React from 'react';
import { Image, StyleSheet } from 'react-native';
import srcCheckedIcon from '@src/assets/images/icons/checked.png';
import srcUnCheckedIcon from '@src/assets/images/icons/un_checked.png';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  defaultStyle: {
    width: 20,
    height: 20,
  },
});

const CheckedIcon = (props) => {
  const { style, checked, ...rest } = props;
  return (
    <Image
      source={checked ? srcCheckedIcon : srcUnCheckedIcon}
      style={[styled.defaultStyle, style]}
      {...rest}
    />
  );
};

CheckedIcon.defaultProps = {
  checked: false,
  style: null,
};

CheckedIcon.propTypes = {
  checked: PropTypes.bool,
  style: PropTypes.any,
};

export default CheckedIcon;
