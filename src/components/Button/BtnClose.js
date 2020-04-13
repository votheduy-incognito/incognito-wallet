import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CloseIcon} from '@src/components/Icons';

const BtnClose = props => {
  return (
    <TouchableOpacity {...props}>
      <CloseIcon />
    </TouchableOpacity>
  );
};

BtnClose.propTypes = {};

export default BtnClose;
