import React from 'react';
import {Icon} from 'react-native-elements';
import PropTypes from 'prop-types';
import {COLORS} from '@src/styles';

const CloseIcon = props => {
  const {colorIcon} = props;
  return <Icon name="close" color={colorIcon} size={28} />;
};

CloseIcon.defaultProps = {
  colorIcon: COLORS.white,
};

CloseIcon.propTypes = {
  colorIcon: PropTypes.string,
};

export default CloseIcon;
