import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withNavigation } from 'react-navigation';
import Modal from '@src/components/Modal';
import withFCM from '@src/screens/Notification/Notification.withFCM';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from 'react-navigation-hooks';
import LocalDatabase from '@utils/LocalDatabase';
import { withdraw } from '@services/api/withdraw';
import { withLayout_2 } from '@src/components/Layout';
import APIService from '@src/services/api/miner/APIService';
import { accountSeleclor } from '@src/redux/selectors';
import { DEX } from '@src/utils/dex';
import { homeSelector } from './Home.selector';
import { actionFetch as actionFetchHomeConfigs } from './Home.actions';

const enhance = (WrappedComp) => (props) => {
  const { getFollowingToken, clearWallet, fetchData } = props;
  const { categories, headerTitle, isFetching } = useSelector(homeSelector);
  const isFocused = useIsFocused();
  const wallet = useSelector((state) => state?.wallet);
  const accounts = useSelector(accountSeleclor.listAccountSelector);
  const dispatch = useDispatch();

  const tryLastWithdrawal = async () => {
    try {
      const txs = await LocalDatabase.getWithdrawalData();
      for (const tx in txs) {
        if (tx) {
          await withdraw(tx);
          await LocalDatabase.removeWithdrawalData(tx.burningTxId);
        }
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  const getHomeConfiguration = async () => {
    try {
      await dispatch(actionFetchHomeConfigs());
    } catch (error) {
      console.log('Fetching configuration for home failed.', error);
    }
  };

  const fetchAirdrop = async () => {
    try {
      const walletAddress = accounts[0]?.PaymentAddress;
      const pDexWalletAddress = accounts.find(
        (account) => account?.accountName === DEX.MAIN_ACCOUNT,
      )?.PaymentAddress;
      await APIService.airdrop1({
        WalletAddress: walletAddress,
        pDexWalletAddress: pDexWalletAddress,
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  React.useEffect(() => {
    if (wallet) {
      getFollowingToken(false);
    }
  }, [wallet]);

  React.useEffect(() => {
    if (isFocused) {
      clearWallet();
    }
  }, [isFocused]);

  React.useEffect(() => {
    fetchData();
    tryLastWithdrawal();
    fetchAirdrop();
  }, []);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          homeProps: {
            headerTitle,
            getHomeConfiguration,
            isFetching,
            categories,
          },
        }}
      />
      <Modal />
    </ErrorBoundary>
  );
};

export default compose(
  withNavigation,
  withFCM,
  withWallet,
  withLayout_2,
  enhance,
);
