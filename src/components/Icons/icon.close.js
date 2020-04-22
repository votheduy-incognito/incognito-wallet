import React from 'react';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {COLORS} from '@src/styles';

const CloseIcon = props => {
  const {colorIcon, size} = props;
  return <Icon name="close" color={colorIcon} size={size} />;
};

CloseIcon.defaultProps = {
  colorIcon: COLORS.white,
  size: 28,
};

CloseIcon.propTypes = {
  colorIcon: PropTypes.string,
  size: PropTypes.number,
};

export default CloseIcon;
