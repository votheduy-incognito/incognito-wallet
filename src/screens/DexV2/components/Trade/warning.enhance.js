import React, { useMemo } from 'react';
import { calculateSizeImpact } from './utils';

const WARNING_STR = 'Do note that due to trade size, the price of this trade varies significantly from market price.';
const withWarning = (WrappedComp) => (props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    minimumAmount
  } = props;

  const {
    impact: impactValue,
    showWarning
  } = calculateSizeImpact(inputValue, inputToken, minimumAmount, outputToken);

  const warning = useMemo(() => {
    return impactValue && showWarning ? WARNING_STR : '';
  }, [impactValue, showWarning]);

  return (
    <WrappedComp
      {...{
        ...props,
        warning,
      }}
    />
  );
};

export default withWarning;
