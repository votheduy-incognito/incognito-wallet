import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CloseIcon} from '@src/components/Icons';
import PropTypes from 'prop-types';
import {COLORS} from '@src/styles';

const BtnClose = props => {
  const {colorIcon, size, ...rest} = props;
  return (
    <TouchableOpacity {...rest}>
      <CloseIcon colorIcon={colorIcon} size={size} />
    </TouchableOpacity>
  );
};

BtnClose.defaultProps = {
  colorIcon: COLORS.white,
  size: 28,
};

BtnClose.propTypes = {
  colorIcon: PropTypes.string,
  size: PropTypes.number,
};

export default BtnClose;
