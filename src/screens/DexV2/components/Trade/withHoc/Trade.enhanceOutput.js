import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionChangeOutputText as changeOutputText,
  actionClearOutputText as clearOutputText,
  actionFilterOutputToken as filterOutputToken,
  actionUpdateOutputToken as updateOutputToken
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';

const enhanceOutput = WrappedComp => (props) => {

  const dispatch = useDispatch();

  const {
    pairs,
    inputToken,
    outputToken
  } = props;

  // When choose newOutputToken, load new pair, calculator outputValue in @actionGetCouplePair
  const onChangeOutputToken = (newOutputToken, skipClearOutputText = false) => {
    if (newOutputToken?.id === outputToken?.id) return;
    dispatch(updateOutputToken({ outputToken: newOutputToken }));
    // clear current outputText
    if (skipClearOutputText) return;
    dispatch(clearOutputText());
  };

  const filterOutput = () => {
    dispatch(filterOutputToken());
  };

  const onChangeOutputText = (newText) => {
    dispatch(changeOutputText(newText));
  };

  useEffect(() => {
    if (inputToken) {
      filterOutput();
    }
  }, [inputToken, pairs]);

  return (
    <WrappedComp
      {...{
        ...props,

        onChangeOutputToken,
        onChangeOutputText,

      }}
    />
  );
};

export default enhanceOutput;
