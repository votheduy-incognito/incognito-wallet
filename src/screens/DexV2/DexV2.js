import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import Header from '@components/Header';
import { View } from '@components/core';
import Trade from '@screens/DexV2/components/Trade';
import { isEmpty } from 'lodash';
import LoadingContainer from '@components/LoadingContainer/index';
import withPairs from '@screens/DexV2/components/pdexPairV2.enhance';
import withData from '@screens/DexV2/DexV2.enhanceData';
import { useDispatch } from 'react-redux';
import { actionClearTradeData } from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import styles from './style';

const Dex = memo((props) =>  {
  const {
    loadingPair,
    tokens,
    pairTokens,
    pairs,
    onLoadPairs,
  } = props;

  const dispatch = useDispatch();

  const renderTrade = () => {
    return (
      <Trade
        pairs={pairs}
        tokens={tokens}
        pairTokens={pairTokens}
        isLoading={loadingPair}
        onLoadPairs={onLoadPairs}
      />
    );
  };

  const renderMode = () => {
    if (isEmpty(tokens) || isEmpty(pairs) || isEmpty(pairTokens)) {
      return <LoadingContainer />;
    }

    return renderTrade();
  };

  useEffect(() => {
    return () => {
      dispatch(actionClearTradeData());
    };
  }, []);

  return (
    <View style={styles.wrapperContainer}>
      <Header title="pDEX" accountSelectable />
      {renderMode()}
    </View>
  );
});

Dex.propTypes = {
  tokens: PropTypes.array.isRequired,
  pairs: PropTypes.array.isRequired,
  pairTokens: PropTypes.array.isRequired,
  onLoadPairs: PropTypes.func.isRequired,
  loadingPair: PropTypes.bool.isRequired,
};

export default compose(
  withData,
  withPairs,
)(Dex);
