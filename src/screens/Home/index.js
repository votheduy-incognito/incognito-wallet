import React from 'react';
import PropTypes from 'prop-types';
import {View} from '@src/components/core';
import icShield from '@assets/images/icons/ic_shield_btn.png';
import icSend from '@assets/images/icons/ic_send_btn.png';
import icReceive from '@assets/images/icons/ic_receive_btn.png';
import icTrade from '@assets/images/icons/ic_trade.png';
import icInvent from '@assets/images/icons/ic_invent_btn.png';
import icBuy from '@assets/images/icons/ic_buy_prv.png';
import IconTextButton from '@screens/Home/IconTextButton';
import ROUTE_NAMES from '@routers/routeNames';

import { withRoundHeaderLayout } from '@src/hoc';

import Card from '@components/Card';
import {BIG_COINS} from '@screens/Dex/constants';
import styles from './style';

const buttons = [
  {
    image: icBuy,
    title: 'Buy PRV',
    route: ROUTE_NAMES.Dex,
    params: {
      inputTokenId: BIG_COINS.USDT,
      outputTokenId: BIG_COINS.PRV,
    },
  },
  {
    image: icShield,
    title: 'Shield',
    desc: 'your crypto',
    route: ROUTE_NAMES.Shield,
  },
  {
    image: icSend,
    title: 'Send',
    desc: 'anonymously',
    route: ROUTE_NAMES.SendCrypto,
  },
  {
    image: icReceive,
    title: 'Receive',
    desc: 'anonymously',
    route: ROUTE_NAMES.ReceiveCoin,
  },
  {
    image: icInvent,
    title: 'Issue',
    desc: 'a new privacy coin',
    route: ROUTE_NAMES.CreateToken,
  },
  {
    image: icTrade,
    title: 'Trade',
    desc: 'anonymously',
    route: ROUTE_NAMES.Dex,
  },
];

const Home = ({ navigation }) => {
  const goToScreen = (route, params) => {
    navigation.navigate(route, params);
  };

  return (
    <Card style={styles.container}>
      <View style={styles.btnContainer}>
        {buttons.map(({ image, title, desc, route, params }) => (
          <View style={styles.btn} key={title}>
            <IconTextButton image={image} title={title} desc={desc} onPress={() => goToScreen(route, params)} />
          </View>
        )
        )}
      </View>
    </Card>
  );
};

Home.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default withRoundHeaderLayout(Home);
