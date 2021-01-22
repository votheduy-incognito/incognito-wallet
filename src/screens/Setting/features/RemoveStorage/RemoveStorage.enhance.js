import React from 'react';
import { Alert } from 'react-native';
import ErrorBoundary from '@src/components/ErrorBoundary';
import AsyncStorage from '@react-native-community/async-storage';
import { split } from 'lodash';
import {loadWallet, saveWallet} from '@services/wallet/WalletService';
import { PASSPHRASE_WALLET_DEFAULT } from 'react-native-dotenv';
import RNRestart from 'react-native-restart';

const REMOVE_HISTORY_KEYS = ['CustomTokenTx', 'NormalTx', 'PrivacyTokenTx'];

const enhance = WrappedComp => props => {
  const [loading, setLoading] = React.useState(false);
  const loadRemoveKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const UTXOCacheds = [];
    const walletCacheds = [];
    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      if (data?.length) {
        const splitResults = split(key, '-');
        if (splitResults && splitResults.length >= 2 && splitResults.length <= 3 && splitResults[splitResults.length - 1] === 'cached') {
          UTXOCacheds.push(key);
        }
        if (key === 'Wallet' || key.includes('master-masterless')) {
          walletCacheds.push(key);
        }
      }
    }
    return { UTXOCacheds, walletCacheds };
  };

  const handleRemoveStorage = async () => {
    try {
      const { UTXOCacheds, walletCacheds } = await loadRemoveKeys();
      if (UTXOCacheds.length === 0 && walletCacheds.length === 0) return;
      setLoading(true);

      /** handle clear account cached */
      UTXOCacheds.forEach(accountKey => {
        AsyncStorage.removeItem(accountKey);
      });

      /** handle clear wallet history*/
      for (const walletName of walletCacheds) {
        const wallet = await loadWallet(PASSPHRASE_WALLET_DEFAULT, walletName) || {};
        wallet.MasterAccount.child.forEach((child) => {
          const txHistory = child.txHistory;
          REMOVE_HISTORY_KEYS.forEach(removeKey => {
            txHistory[removeKey] = [];
          });
        });
        /** Update wallet after clear */
        await saveWallet(wallet);
      }

      setLoading(false);

      /** Restart app */
      RNRestart.Restart();
    } catch (e) {
      setLoading(false);
      console.debug('Remove storage with error: ', e);
    }
  };

  const onPressRemove = () => {
    Alert.alert(
      'Clear history',
      'This will delete transaction histories from display. Are you sure you want to continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        { text: 'OK', onPress: handleRemoveStorage }
      ],
      { cancelable: false }
    );
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          loading,
          onPressRemove,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
