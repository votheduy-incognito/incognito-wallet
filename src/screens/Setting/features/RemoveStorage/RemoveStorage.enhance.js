import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import AsyncStorage from '@react-native-community/async-storage';
import { split } from 'lodash';
import {loadWallet, saveWallet} from '@services/wallet/WalletService';
import { PASSPHRASE_WALLET_DEFAULT } from 'react-native-dotenv';
import RNRestart from 'react-native-restart';
import { FAKE_FULL_DISK_KEY } from '@screens/Setting/features/DevSection/DevSection.utils';
import { useDispatch } from 'react-redux';
import { actionLogEvent } from '@screens/Performance';
import RemoveDialog from '@screens/Setting/features/RemoveStorage/RemoveStorage.Dialog';
import DialogLoader from '@components/DialogLoader';

const REMOVE_HISTORY_KEYS = ['CustomTokenTx', 'NormalTx', 'PrivacyTokenTx'];

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const [removing, setRemoving] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const loadRemoveKeys = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const UTXOCacheds = [];
    const walletCacheds = [];
    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      if (data?.length) {
        const splitResults = split(key, '-');
        if (key.includes(FAKE_FULL_DISK_KEY) ||
          (splitResults
            && splitResults.length >= 2
            && splitResults.length <= 3
            && splitResults[splitResults.length - 1] === 'cached'))
        {
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
      setRemoving(true);
      const { UTXOCacheds, walletCacheds } = await loadRemoveKeys();
      if (UTXOCacheds.length === 0 && walletCacheds.length === 0) return;

      /** handle clear account cached */
      UTXOCacheds.forEach(accountKey => {
        dispatch(actionLogEvent({ desc: 'START REMOVE WITH ACCOUNT: ' + accountKey}));
        AsyncStorage.removeItem(accountKey);
      });

      /** handle clear wallet history*/
      for (const walletName of walletCacheds) {
        const wallet = await loadWallet(PASSPHRASE_WALLET_DEFAULT, walletName) || {};
        if (wallet && wallet.MasterAccount && wallet.MasterAccount.child) {
          dispatch(actionLogEvent({ desc: 'START REMOVE WITH WALLET: ' + walletName}));
          wallet.MasterAccount.child.forEach((child) => {
            const txHistory = child.txHistory;
            REMOVE_HISTORY_KEYS.forEach(removeKey => {
              txHistory[removeKey] = [];
            });
          });
          /** Update wallet after clear */
          await saveWallet(wallet);
        }
      }
    } catch (e) {
      dispatch(actionLogEvent({ desc: 'ERROR REMOVE DATA: ' + JSON.stringify(e) }));
    } finally {
      setRemoving(false);
      /** Restart app */
      RNRestart.Restart();
    }
  };

  const onPressRemove = () => setVisible(true);

  return (
    <>
      <ErrorBoundary>
        <WrappedComp
          {...{
            ...props,
            onPressRemove,
          }}
        />
      </ErrorBoundary>
      <RemoveDialog
        visible={visible}
        onPressCancel={() => setVisible(false)}
        onPressAccept={() => {
          setVisible(false);
          handleRemoveStorage().then();
        }}
      />
      <DialogLoader loading={removing} />
    </>
  );
};

export default enhance;
