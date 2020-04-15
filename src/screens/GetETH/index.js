import React from 'react';
import {Text, ScrollView, TouchableOpacity} from '@src/components/core';
import LinkingService from '@services/linking';
import styles from './style';

const GetETH = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        To use pUniswap on the testnet, you need testnet coins.
      </Text>
      <Text style={[styles.title, styles.paddingBottom]}>
        Here’s how to get testnet privacy ETH (pETH):
      </Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 1:</Text> Tap on “Shield” in the home screen</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 2:</Text> Select “ETH”</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 3:</Text> Tap on “Shield”</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 4:</Text> Copy the address shown</Text>
      <Text><Text style={styles.bold}>Step 5:</Text> Open below link with your browser:</Text>
      <TouchableOpacity onPress={() => LinkingService.openUrl('https://faucet.kovan.network/')}>
        <Text style={[styles.link, styles.paddingBottom]}>https://faucet.kovan.network/</Text>
      </TouchableOpacity>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 6:</Text> Create or log in to your GitHub account</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 7:</Text> Paste the address into kovan address field </Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 8:</Text> Tap on “Send me KETH!” </Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 9:</Text> Once you have received your testnet pETH (this may take a few minutes), open pUniswap</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 10:</Text> Tap on “Deposit” to transfer your testnet pETH to your smart contract.</Text>
    </ScrollView>
  );
};

export default React.memo(GetETH);
