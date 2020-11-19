import React, { useMemo } from 'react';
import { calculateSizeImpact } from './utils';

const WARNING_STR = 'This pool has low liquidity. Please note prices.';
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
