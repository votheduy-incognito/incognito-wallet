import React from 'react';
import { RetryIcon } from '@src/components/Icons';
import { TouchableOpacity } from '@src/components/core';

const BtnRetry = (props) => {
  return (
    <TouchableOpacity {...props}>
      <RetryIcon />
    </TouchableOpacity>
  );
};

export default React.memo(BtnRetry);
