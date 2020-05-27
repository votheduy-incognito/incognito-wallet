import React from 'react';

const withERC20 = WrappedComp => (props) => {
  const {
    inputToken,
    outputToken,
  } = props;

  return (
    <WrappedComp
      {...{
        ...props,
        isErc20: !!(inputToken?.address && outputToken?.address),
      }}
    />
  );
};

export default withERC20;
