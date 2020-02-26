import React from 'react';
import {Text, ScrollView} from '@src/components/core';
import styles from './style';

const WhyShield = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        To transact anonymously, first you have to shield your crypto.
        When you send coins to be shielded, an identical – but 100% private – version is generated.
        If you withdraw your coins from the Incognito network,
        this privacy version will be burned, and the original will be returned.
        All original coins are stored safely using the methods below:
      </Text>
      <Text style={styles.title}>Trustless bridge for Ethereum</Text>
      <Text style={styles.text}>
        For ETH and all ERC20 tokens, your crypto is safely secured in a trustless smart contract.
      </Text>
      <Text style={styles.title}>Portal (Upcoming)</Text>
      <Text style={styles.text}>
        For other coins, your crypto is stored in one of the wallets maintained by the Incognito Core team. We’re working on a trustless solution for this too, called Portal.
      </Text>
    </ScrollView>
  );
};

export default React.memo(WhyShield);
