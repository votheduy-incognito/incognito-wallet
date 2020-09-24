import React from 'react';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Text, View } from '@components/core';
import theme from '@src/styles/theme';
import AntDesign from 'react-native-vector-icons/AntDesign';
import linkingService from '@services/linking';
import { CONSTANT_CONFIGS } from '@src/constants';
import { COLORS } from '@src/styles';
import routeNames from '@routers/routeNames';
import { useNavigation } from 'react-navigation-hooks';

const Currency = ({ coinSymbol, onSelectCoin, coins }) => {
  const navigation = useNavigation();
  const showSelectCoinScreen = () => {
    navigation.navigate(routeNames.TokenSelectScreen, {
      onSelectToken: onSelectCoin,
      tokens: coins.map(coin => ({
        ...coin,
        id: coin.tokenId,
      })),
      placeholder: 'Search coins',
    });
  };

  return (
    <View>
      <View style={[theme.FLEX.rowSpaceBetween, theme.MARGIN.marginTopAvg]}>
        <Text style={[theme.text.boldTextStyleMedium]}>Pay with privacy coins</Text>
        <View style={{flexDirection: 'row', justifyContent: 'flex-end',  alignItems: 'center'}}>
          <TouchableOpacity onPress={showSelectCoinScreen}>
            <Text style={[theme.text.boldTextStyleMedium]}>{coinSymbol}</Text>
          </TouchableOpacity>
          <AntDesign name="right" size={18} color={COLORS.newGrey} />
        </View>
      </View>
      <TouchableOpacity onPress={()=>{linkingService.openUrl(`${CONSTANT_CONFIGS.NODE_URL}`);}} style={[theme.FLEX.rowSpaceBetween]}>
        <Text style={[theme.text.boldTextStyleMedium, { color: COLORS.blue4, marginTop: 10, }]}>See more currencies</Text>
      </TouchableOpacity>
    </View>
  );
};

Currency.propTypes = {
  onSelectCoin: PropTypes.func.isRequired,
  coins: PropTypes.array.isRequired,
  coinSymbol: PropTypes.string.isRequired,
};

export default Currency;
