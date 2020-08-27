/* eslint-disable import/named */
/* eslint-disable no-unsafe-finally */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { pTokensSelector } from '@src/redux/selectors/token';
import { withdrawReceiversSelector } from '@src/redux/selectors/receivers';
import {
  detectNetworkNameSelector,
  actionToggleDetectNetworkName,
} from '@screens/GetStarted';
import { CONSTANT_KEYS, CONSTANT_COMMONS } from '@src/constants';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { trim } from 'lodash';
import { actionUpdate } from '@src/redux/actions/receivers';
import { getExternalSymbol } from './FrequentReceivers.utils';

const enhance = (WrappedComp) => (props) => {
  const pTokens = useSelector(pTokensSelector);
  const dispatch = useDispatch();
  const { receivers } = useSelector(withdrawReceiversSelector);
  const detectNetworkName = useSelector(detectNetworkNameSelector)[
    CONSTANT_KEYS.DETECT_NETWORK_NAME
  ];
  const getPrivacyDataByTokenID = useSelector(
    selectedPrivacySeleclor.getPrivacyDataByTokenID,
  );

  const getNetworkNameByAddress = ({ address }) => {
    let networkName = '';
    try {
      const externalSymbol = getExternalSymbol(address);
      const token = pTokens.find((token) => {
        return token?.symbol === externalSymbol;
      });
      const tokenData = getPrivacyDataByTokenID(token?.tokenId);
      const isETH =
        tokenData?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH;
      const isBNB =
        tokenData?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BNB;
      if (tokenData) {
        networkName = tokenData?.networkName;
        if (tokenData?.isErc20Token || isETH) {
          networkName = 'Ethereum';
        } else if (tokenData?.isBep2Token || isBNB) {
          networkName = 'Binance';
        }
      }
    } catch (error) {
      console.debug(error);
    }
    return networkName;
  };

  const handleDetectNetwork = async () => {
    try {
      if (detectNetworkName) {
        return;
      }
      await new Promise.all([
        receivers.map(async (receiver) => {
          const { address } = receiver;
          const networkName = getNetworkNameByAddress({
            address: trim(address),
          });
          const _receiver = { ...receiver, networkName };
          await dispatch(
            actionUpdate({
              keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
              receiver: _receiver,
            }),
          );
        }),
      ]);
      await dispatch(
        actionToggleDetectNetworkName({
          keySave: CONSTANT_KEYS.DETECT_NETWORK_NAME,
        }),
      );
    } catch (error) {
      console.debug(error);
    }
  };
  React.useEffect(() => {
    handleDetectNetwork();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
