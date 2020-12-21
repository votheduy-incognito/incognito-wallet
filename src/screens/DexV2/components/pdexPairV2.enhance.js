import React, { useEffect } from 'react';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@src/constants';
import { useDispatch } from 'react-redux';
import {
  actionUpdateLoadingPair,
  actionUpdatePairData
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { getPairsData } from '@screens/DexV2/components/DexV2.utils';

const withPairs = WrappedComp => (props) => {

  const dispatch = useDispatch();

  const loadPairs = async () => {
    try {
      dispatch(actionUpdateLoadingPair(true));
      const payload = await getPairsData();
      dispatch(actionUpdatePairData(payload));
    } catch (error) {
      new ExHandler(error, MESSAGES.CAN_NOT_GET_PDEX_DATA).showErrorToast();
    } finally {
      dispatch(actionUpdateLoadingPair(false));
    }
  };

  useEffect(() => {
    loadPairs().then();
  }, []);

  return (
    <WrappedComp
      {...{
        ...props,

        onLoadPairs: loadPairs,
      }}
    />
  );
};

export default withPairs;
