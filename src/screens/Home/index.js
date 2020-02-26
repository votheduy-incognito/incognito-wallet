import React from 'react';
import {View} from '@src/components/core';
import HomeHeader from '@screens/Home/Header';
import icShield from '@assets/images/icons/ic_shield_btn.png';
import icSend from '@assets/images/icons/ic_send_btn.png';
import icReceive from '@assets/images/icons/ic_receive_btn.png';
import icTrade from '@assets/images/icons/ic_trade_btn.png';
import icInvent from '@assets/images/icons/ic_invent_btn.png';
import IconTextButton from '@screens/Home/IconTextButton';
import ROUTE_NAMES from '@routers/routeNames';

import styles from './style';

const buttons = [
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
    image: icTrade,
    title: 'Trade',
    desc: 'anonymously',
    route: ROUTE_NAMES.Dex,
  },
  {
    image: icInvent,
    title: 'Issue',
    desc: 'a new privacy coin',
    route: ROUTE_NAMES.CreateToken,
  },
];

const Home = ({ navigation }) => {
  const goToScreen = (route) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <View style={styles.btnContainer}>
        {buttons.map(({ image, title, desc, route }) => (
          <View style={styles.btn} key={title}>
            <IconTextButton image={image} title={title} desc={desc} onPress={() => goToScreen(route)} />
          </View>
        )
        )}
      </View>
    </View>
  );
};

export default Home;
