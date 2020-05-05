import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Button, Image, Text, View} from '@components/core';

import icBTC from '@src/assets/images/coins/ic_btc.png';
import icPRV from '@src/assets/images/coins/ic_prv.png';
import icETH from '@src/assets/images/coins/ic_eth.png';
import icXMR from '@src/assets/images/coins/ic_xmr.png';
import icUSDT from '@src/assets/images/coins/ic_usdt.png';
import icUSDC from '@src/assets/images/coins/ic_usdc.png';
import InvestReward from '@screens/Dex/components/InvestReward';
import {getRewards} from '@services/api/pdefi';
import _ from 'lodash';
import {CONSTANT_COMMONS} from '@src/constants';
import {PRV_ID} from '@screens/Dex/constants';
import format from '@utils/format';
import styles from './style';

const items = [
  {
    icon: icPRV,
    symbol: 'PRV',
    interest: '62.7%',
  },
  {
    icon: icBTC,
    symbol: 'BTC',
    interest: '5%',
  },
  {
    icon: icETH,
    symbol: 'ETH',
    interest: '8.5%',
  },
  {
    icon: icXMR,
    symbol: 'XMR',
    interest: '8%',
  },
  {
    icon: icUSDT,
    symbol: 'USDT',
    interest: '8%',
  },
  {
    icon: icUSDC,
    symbol: 'USDC',
    interest: '8%',
  },
];

let rewardInterval;
const TIME = 100;

const GetStartedInvest = ({ onPress, accounts, pairs, shares, tokens }) => {
  const [loading, setLoading] = React.useState(true);
  const [rewards, setRewards] = React.useState(null);
  const [totalReward, setTotalReward] = React.useState(0);

  const isUserPair = (tokenIds) => key => {
    if (tokenIds.every(item => key.includes(item))) {
      return accounts.some(account => key.includes(account.PaymentAddress));
    }
  };

  const findShareKey = (shares, tokenIds) => {
    return Object.keys(shares).find(isUserPair(tokenIds));
  };

  const loadData = async () => {
    const investAccounts = pairs
      .map(pairInfo => {
        const tokenIds = pairInfo.keys;
        const token1 = tokens.find(item => item.id === tokenIds[0]);
        const token2 = tokens.find(item => item.id === tokenIds[1]);
        const shareKey = findShareKey(shares, tokenIds);

        if (!shareKey || !(
          (tokenIds[0] === PRV_ID && token2.hasIcon) ||
          (tokenIds[1] === PRV_ID && token1.hasIcon) ||
          (token1.hasIcon && token2.hasIcon)
        )) {
          return null;
        }

        return {
          share: shares[shareKey],
          account: accounts.find(account => shareKey.includes(account.PaymentAddress)),
        };
      })
      .filter(pair => pair && pair.share > 0)
      .map(item => item.account);

    const rewards = _.flatten(await Promise.all(investAccounts.map(account => getRewards(account.PaymentAddress))));
    setRewards(rewards);
    setLoading(false);
  };

  const calculateOutputValue = (outputTokenId, inputTokenId, inputValue) => {
    try {
      const pair = pairs.find(i => {
        const keys = Object.keys(i);
        return keys.includes(outputTokenId) && keys.includes(inputTokenId);
      });

      const inputPool = pair[inputTokenId];
      const outputPool = pair[outputTokenId];
      const initialPool = inputPool * outputPool;
      const newInputPool = inputPool + inputValue - 0;
      const newOutputPoolWithFee = _.ceil(initialPool / newInputPool);
      return outputPool - newOutputPoolWithFee;
    } catch (error) {
      //
    }
  };

  const calculateReward = () => {
    let totalReward = 0;
    rewards.forEach(reward => {
      const {amount1, amount2, tokenId1, tokenId2, interestRate1, interestRate2, total, beaconTime} = reward;
      const time = (new Date().getTime()) / 1000 - beaconTime;

      const reward1 =
        amount1 * time * interestRate1 / 100 / CONSTANT_COMMONS.YEAR_SECONDS;
      const reward2 =
        amount2 * time * interestRate2 / 100 / CONSTANT_COMMONS.YEAR_SECONDS;

      const prvReward1 = tokenId1 === PRV_ID ? reward1 : calculateOutputValue(PRV_ID, tokenId1, reward1);
      const prvReward2 = tokenId2 === PRV_ID ? reward2 : calculateOutputValue(PRV_ID, tokenId2, reward2);

      totalReward = totalReward + total + prvReward1 + prvReward2;
    });

    totalReward = Math.floor(totalReward);
    let maxDigits = totalReward > 1000e9 ? 4 : 9;
    maxDigits = totalReward > 1000000e9 ? 0 : maxDigits;

    const displayReward = format.balance(
      totalReward,
      9,
      maxDigits,
    );
    setTotalReward(displayReward);
  };

  React.useEffect(() => {
    clearInterval(rewardInterval);
    loadData();
  }, []);

  React.useEffect(() => {
    clearInterval(rewardInterval);

    if (!rewards || rewards.length === 0) {
      return;
    }

    calculateReward();

    rewardInterval = setInterval(calculateReward, TIME);
  }, [rewards]);

  if (loading) {
    return <ActivityIndicator />;
  }

  if (rewards && rewards.length > 0) {
    return (
      <InvestReward reward={totalReward} onPress={onPress} />
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Grow your crypto</Text>
        <Text style={styles.description}>No minimum. Earn interest every second, and withdraw anytime. <Text style={[styles.bold, styles.description]}>$2M</Text> in crypto already invested to date.</Text>
      </View>
      <View style={styles.coins}>
        {items.map(item => (
          <View key={item.symbol} style={styles.coin}>
            <Image style={styles.icon} source={item.icon} />
            <Text style={styles.bold}>{item.symbol}</Text>
            <Text><Text style={styles.bold}>{item.interest}</Text> APR</Text>
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Get started" onPress={onPress} style={styles.btn} />
      </View>
    </View>
  );
};

GetStartedInvest.propTypes = {
  onPress: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  pairs: PropTypes.array.isRequired,
  shares: PropTypes.array.isRequired,
  tokens: PropTypes.array.isRequired,
};

export default GetStartedInvest;
