import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionChangeOutputText as changeOutputText,
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

  // When choose newOutputToken, load new pair
  const onChangeOutputToken = (newOutputToken) => {
    if (newOutputToken?.id === outputToken?.id) return;
    dispatch(updateOutputToken({ outputToken: newOutputToken }));
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
