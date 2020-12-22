import React from 'react';

const enhanceSwap = WrappedComp => (props) => {
  const {
    onChangeInputToken,
    onChangeOutputToken,
    inputToken,
    outputToken,
    inputBalance,
  } = props;

  const swapTokens = () => {
    if (!inputToken || !outputToken || inputBalance === null) {
      return;
    }

    onChangeOutputToken(inputToken);
    onChangeInputToken(outputToken);
  };

  return (
    <WrappedComp
      {...{
        ...props,

        onSwapTokens: swapTokens,
      }}
    />
  );
};

export default enhanceSwap;