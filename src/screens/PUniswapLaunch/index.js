import React from 'react';
import {Text, ScrollView, TouchableOpacity, View} from '@src/components/core';
import {Icon} from 'react-native-elements';
import COLORS from '@src/styles/colors';
import styles from './style';

const PUniswapLaunch = () => {
  const [more, setMore] = React.useState(false);
  const toggleMore = () => setMore(!more);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>
        pUniswap is currently in testnet phase. The mainnet launch is scheduled for 10 May 2020.
      </Text>
      <Text style={[styles.title, styles.paddingBottom]}>
        Here’s how to explore pUniswap on the testnet:
      </Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 1:</Text> Tap on the gear icon in the home screen</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 2:</Text> Tap on “Mainnet” in the Network section</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 3:</Text> Switch to “Testnet”</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 4:</Text> Open pUniswap</Text>
      <Text style={styles.paddingBottom}><Text style={styles.bold}>Step 5:</Text> Tap on “Get Testnet ETH”</Text>

      <View>
        <TouchableOpacity onPress={toggleMore} style={{flexDirection: 'row'}}>
          <Text style={[styles.title, styles.paddingBottom]}>
            Important notes
          </Text>
          <Icon
            name={more ? 'chevron-up' : 'chevron-down'}
            type="material-community"
            color={COLORS.primary}
            containerStyle={{justifyContent: 'center'}}
          />
        </TouchableOpacity>
        {more && (
          <Text style={styles.text}>{
            'Mainnet account balances will not show on the testnet.' +
              '\n\n' +
            'Testnet coins have no value on the mainnet, and cannot be ported over.' +
              '\n\n' +
            'Please not use your testnet account address to receive mainnet coins. If you do this by accident, copy the private key of your testnet account, switch back to mainnet, then import the private key.'
          }
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default React.memo(PUniswapLaunch);
