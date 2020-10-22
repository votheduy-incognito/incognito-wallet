import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '@components/Header';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { LoadingContainer } from '@src/components/core';
import { pairsSelector } from '@screens/DexV2/features/Pairs';
import Trade from './features/Trade';
import withDexV2 from './DexV2.enhance';

const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const DexV2 = React.memo(() => {
  const pairsState = useSelector(pairsSelector);
  const { pairTokens, pairs, tokens } = pairsState?.data;
  const renderMain = () => {
    if (_.isEmpty(tokens) || _.isEmpty(pairs) || _.isEmpty(pairTokens)) {
      return <LoadingContainer />;
    }
    return <Trade />;
  };
  return (
    <View style={styled.container}>
      <Header title="pDEX" accountSelectable />
      {renderMain()}
    </View>
  );
});

DexV2.propTypes = {};

export default withDexV2(DexV2);
