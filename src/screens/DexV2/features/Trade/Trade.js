/* eslint-disable import/no-cycle */
import { ScrollView, TouchableOpacity } from '@src/components/core';
import React from 'react';
import { View, Text } from 'react-native';
import FormTrade from '@screens/DexV2/features/Form';
import { useSelector } from 'react-redux';
import {
  Balance,
  ExchangeRate,
  PoolSize,
  Powered,
  ExtraInfo,
} from '@screens/DexV2/components';
import { ArrowRightGreyIcon } from '@src/components/Icons';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { historiesSelector } from '@screens/DexV2/features/Histories';
import { tradeSelector } from './Trade.selector';
import withTrade from './Trade.enhance';
import { styled } from './Trade.styled';

const Extra = React.memo(() => {
  const {
    inputToken,
    outputToken,
    inputBalance,
    inputValue,
    outputValue,
    minimumAmount,
    quote,
    pair,
    isErc20,
    warning,
    network,
  } = useSelector(tradeSelector);
  return (
    !!(inputToken && outputToken) && (
      <View style={styled.extraInfo}>
        <Balance token={inputToken} balance={inputBalance} />
        <ExchangeRate
          inputValue={inputValue}
          outputValue={outputValue}
          minimumAmount={minimumAmount}
          inputToken={inputToken}
          outputToken={outputToken}
          quote={quote}
        />
        {!!(!isErc20 && pair) && (
          <PoolSize
            outputToken={outputToken}
            inputToken={inputToken}
            pair={pair}
          />
        )}
        <Powered network={network} />
        <ExtraInfo left={warning} right="" style={styled.warning} />
      </View>
    )
  );
});

const Histories = React.memo(() => {
  const { histories } = useSelector(historiesSelector);
  const navigation = useNavigation();
  const navigateHistory = () => {
    navigation.navigate(routeNames.TradeHistory);
  };
  return (
    <View style={styled.bottomBar}>
      {!!histories.length && (
        <TouchableOpacity
          onPress={navigateHistory}
          style={styled.bottomFloatBtn}
        >
          <Text style={styled.bottomText}>Order history</Text>
          <ArrowRightGreyIcon style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      )}
    </View>
  );
});

const Trade = () => {
  return (
    <View style={styled.container}>
      <ScrollView>
        <View style={styled.wrapper}>
          <FormTrade />
          <Extra />
        </View>
      </ScrollView>
      <Histories />
    </View>
  );
};

Trade.propTypes = {};

export default React.memo(withTrade(Trade));
