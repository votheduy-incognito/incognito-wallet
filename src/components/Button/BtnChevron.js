import React from 'react';
import { ChevronIcon } from '@src/components/Icons';
import { TouchableOpacity } from '@src/components/core';

const BtnRetry = (props) => {
  return (
    <TouchableOpacity {...props}>
      <ChevronIcon size={props?.size} toggle={props?.toggle} />
    </TouchableOpacity>
  );
};

export default React.memo(BtnRetry);
