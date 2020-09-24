import _ from 'lodash';
import convert from '@utils/convert';
import { COINS } from '@src/constants';

export const parseNodeRewardsToArray = (rewards, allTokens) => {
  const rewardList = (_(Object.keys(rewards)) || [])
    .map(id => {
      const value = rewards[id];
      const token = allTokens.find(token => token.id === id) || {};
      return token && {...token, balance: value, displayBalance: convert.toHumanAmount(value, token.pDecimals)};
    })
    .filter(coin => coin)
    .orderBy(item => item.displayBalance, 'desc')
    .value();

  if (rewardList.length === 0) {
    rewardList.push({
      ...COINS.PRV,
      balance: 0,
      displayBalance: 0,
    });
  }

  return rewardList;
};
