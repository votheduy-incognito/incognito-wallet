import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Swiper from 'react-native-swiper';
import {View} from '@components/core';
import _ from 'lodash';
import convert from '@utils/convert';
import {PRV_ID} from '@screens/Dex/constants';
import { rewardStyle } from './style';
import Reward from './Reward';

class Rewards extends PureComponent {
  render() {
    const { rewards: propRewards, allTokens } = this.props;
    const rewards = !_.isEmpty(propRewards) ? propRewards : { [PRV_ID] : 0};
    const data = _(Object.keys(rewards))
      .map(id => {
        const value = rewards[id];
        const token = allTokens.find(token => token.id === id);
        return token && { ...token, balance: value, displayBalance: convert.toHumanAmount(value, token.pDecimals) };
      })
      .filter(item => item && (item.id === PRV_ID || item.balance > 0))
      .orderBy([token => token.id === PRV_ID, 'displayBalance'], ['desc', 'desc'])
      .value();

    return (
      <View style={rewardStyle.slider}>
        <Swiper
          dotStyle={rewardStyle.dot}
          activeDotStyle={rewardStyle.activeDot}
          showsPagination
          loop
          key={data.length}
        >
          {
            data.map(({ id, pDecimals, balance, symbol }) => (
              <Reward key={id} tokenId={id} pDecimals={pDecimals} symbol={symbol} balance={balance} />
            ))
          }
        </Swiper>
      </View>
    );
  }
}

Rewards.propTypes = {
  allTokens: PropTypes.array.isRequired,
  rewards: PropTypes.object.isRequired,
};

export default Rewards;
