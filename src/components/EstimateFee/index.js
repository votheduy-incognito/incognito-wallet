import React from 'react';
import PropTypes from 'prop-types';
import EstimateFee from './EstimateFee';

const EstimateFeeContainer = ({ minFee, onSelectFee, onEstimateFee, types, onRef, ...otherProps }) => {
  return <EstimateFee {...otherProps} minFee={minFee} types={types} onEstimateFee={onEstimateFee} onSelectFee={onSelectFee} onRef={onRef} />;
};

EstimateFeeContainer.defaultProps = {
  minFee: null,
  onRef: null
};

EstimateFeeContainer.propTypes = {
  types: PropTypes.array.isRequired,
  onSelectFee: PropTypes.func.isRequired,
  onEstimateFee: PropTypes.func.isRequired,
  onRef: PropTypes.func,
  minFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default EstimateFeeContainer;
