import React from 'react';
import { Text, ScrollView } from '@src/components/core';
import styles from './style';

const WhySend = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        What does in-network mean?
      </Text>
      <Text style={styles.text}>
        When you send in-network, you’re sending pCoins (pBTC, pETH, etc.) to another Incognito address. All Incognito addresses follow this format: 12xxxxxetc.
      </Text>
      <Text style={styles.title}>What does out-network mean? </Text>
      <Text style={styles.text}>
        When you send out-network, you’re sending to a wallet outside the Incognito network – for example, an Ethereum wallet beginning with 0x. This is considered a withdrawal from the network, and will convert your pCoins to Coins (pETH -&gt; ETH). From your end, the transaction is anonymous. On the receiver’s end, it will show up on its respective block explorer, with an address that is not linked to you.
      </Text>
    </ScrollView>
  );
};

export default React.memo(WhySend);
