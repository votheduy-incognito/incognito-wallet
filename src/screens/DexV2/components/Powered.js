import React from 'react';
import PropTypes from 'prop-types';
import ExtraInfo from '@screens/DexV2/components/ExtraInfo';
import { COLORS } from '@src/styles';

const Powered = ({ network }) => {
  return (
    <ExtraInfo
      left=""
      right={`Powered by ${network} Network`}
      style={{
        color: COLORS.lightGrey16,
      }}
    />
  );
};

Powered.propTypes = {
  network: PropTypes.string.isRequired,
};

export default Powered;
