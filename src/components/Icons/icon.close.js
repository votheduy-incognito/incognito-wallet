import React from 'react';
import srcCloseIcon from '@assets/images/icons/close_icon.png';
import PropTypes from 'prop-types';
import { Image } from 'react-native';

const CloseIcon = props => {
  const { size } = props;
  return (
    <Image
      source={srcCloseIcon}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

CloseIcon.defaultProps = {
  size: 28,
};

CloseIcon.propTypes = {
  size: PropTypes.number,
};

export default CloseIcon;
