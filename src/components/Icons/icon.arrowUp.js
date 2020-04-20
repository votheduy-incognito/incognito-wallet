import React from 'react';
import {Image} from 'react-native';
import srcArrowUpIcon from '@src/assets/images/icons/arrow_up_primary.png';
import PropTypes from 'prop-types';

const ArrowUpIcon = props => {
  const defaultStyle = {
    width: 14,
    height: 18,
  };
  const {style, ...rest} = props;
  return (
    <Image source={srcArrowUpIcon} style={[defaultStyle, style]} {...rest} />
  );
};

ArrowUpIcon.defaultProps = {
  style: null,
};

ArrowUpIcon.propTypes = {
  style: PropTypes.any,
};

export default ArrowUpIcon;
