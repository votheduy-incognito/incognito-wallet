import React from 'react';

const enhanceSwap = WrappedComp => (props) => {
  const {
    onChangeInputToken,
    onChangeOutputToken,
    inputToken,
    outputToken,
    inputBalance,
    disableButton
  } = props;

  const swapTokens = () => {
    if (!inputToken || !outputToken || inputBalance === null || disableButton.disableInput || disableButton.disableOutput) {
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