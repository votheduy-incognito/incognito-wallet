import React from 'react';
import { Text, ScrollView } from '@src/components/core';
import styles from './style';

const WhyReceive = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        What does in-network mean?
      </Text>
      <Text style={styles.text}>
        Receiving in-network simply means receiving pCoins (pBTC, pETH, etc.) from another Incognito wallet address. All Incognito addresses follow this format: 12xxxxxetc.
      </Text>
      <Text style={styles.title}>What does out-network mean? </Text>
      <Text style={styles.text}>
        When you receive out-network, you are choosing to receive a public coin anonymously. Let’s say you want to anonymize your trading funds. This feature allows you to receive your BTC as pBTC (privacy Bitcoin). You simply have to select the currency you wish to receive, and use the one-time address generated (not linked to your Incognito address). Note that this receive address will expire after 60 minutes.
      </Text>
    </ScrollView>
  );
};

export default React.memo(WhyReceive);
