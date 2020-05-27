import React from 'react';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { COLORS } from '@src/styles';

const Powered = () => {
  return (
    <ExtraInfo
      left="Powered by Kyber Network"
      right=""
      style={{
        color: COLORS.green,
      }}
    />
  );
};

export default Powered;
