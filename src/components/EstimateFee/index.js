import React from 'react';
import PropTypes from 'prop-types';
import EstimateFee from './EstimateFee';

const EstimateFeeContainer = ({ fee, onSelectFee, feeUnit, ...otherProps }) => {
  if (!fee && fee !== 0) {
    return null;
  }

  return <EstimateFee {...otherProps} fee={fee} feeUnit={feeUnit} onSelectFee={onSelectFee} />;
};

EstimateFeeContainer.defaultProps = {
  fee: null,
};

EstimateFeeContainer.propTypes = {
  feeUnit: PropTypes.string.isRequired,
  onSelectFee: PropTypes.func.isRequired,
  fee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default EstimateFeeContainer;
