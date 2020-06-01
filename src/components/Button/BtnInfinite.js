import React from 'react';
import { TouchableOpacity } from '@src/components/core';
import { InfiniteIcon } from '@src/components/Icons';

const BtnInfinite = props => {
  return (
    <TouchableOpacity {...props}>
      <InfiniteIcon />
    </TouchableOpacity>
  );
};

export default BtnInfinite;
