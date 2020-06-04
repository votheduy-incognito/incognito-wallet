import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, View, Text, ActivityIndicator, Toast} from '@src/components/core';
import {useNavigationParam } from 'react-navigation-hooks';
import ROUTES_NAME from '@routers/routeNames';
import {useDispatch, useSelector} from 'react-redux';
import {accountSeleclor, selectedPrivacySeleclor, settingsSelector} from '@src/redux/selectors';
import {getBalance } from '@src/redux/actions/account';
import {getBalance as getTokenBalance} from '@src/redux/actions/token';
import {PRV_ID} from '@screens/Dex/constants';
import {BtnQuestion} from '@src/components/Button';
import KeepAwake from 'react-native-keep-awake';
import { MESSAGES } from '@src/constants';
import SendIn from './SendIn';
import SendOut from './SendOut';
import styles from './style';

const modes = [
  {
    text: 'In Network',
    component: SendIn,
  },
  {
    text: 'Out Network',
    component: SendOut,
  }
];

const SendCoin = ({ navigation }) => {
  SendCoin.navigationOptions = {
    headerRight: <BtnQuestion onPress={() => navigation.navigate(ROUTES_NAME.WhySend)} />
  };
  const [mode, setMode] = React.useState(modes[0]);
  const [reloading, setReloading] = React.useState(false);
  const origin = useNavigationParam('origin');
  const { wallet, account, selectedPrivacy, settings, getPrivacyDataByTokenID } = useSelector(state => ({
    selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
    account: accountSeleclor.defaultAccount(state),
    wallet: state.wallet,
    settings: settingsSelector.settings(state),
    getPrivacyDataByTokenID: selectedPrivacySeleclor.getPrivacyDataByTokenID(state),
  }));
  const dispatch = useDispatch();
  const selectable = origin !== ROUTES_NAME.WalletDetail;
  const switchable = selectable || (!selectable && selectedPrivacy.isPToken);

  const switchMode = (item) => {
    if (item.text === 'Out Network') {
      const tokenId = selectedPrivacy.tokenId;
      const tokenData = getPrivacyDataByTokenID(tokenId);
      if (settings.disableDecentralized && tokenData?.isDecentralized) {
        Toast.showError(MESSAGES.DISABLE_ETH_BRIDGE);
        return false;
      }
    }

    setMode(item);
  };

  const reloadBalance = () => {
    setReloading(true);
    if (selectedPrivacy.tokenId === PRV_ID) {
      dispatch(getBalance(account));
    } else {
      dispatch(getTokenBalance(selectedPrivacy));
    }
    setReloading(false);
  };

  const Component = mode.component;

  if (!selectedPrivacy) {
    return (
      <ActivityIndicator />
    );
  }

  useEffect(() => {
    if (origin !== ROUTES_NAME.WalletDetail) {
      reloadBalance();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.modes}>
          {modes.slice(0, switchable ? 2 : 0)?.map(item => (
            <TouchableOpacity
              key={item.text}
              onPress={() => switchMode(item)}
              style={[styles.mode, item.text !== mode.text && styles.deactiveMode]}
            >
              <Text style={[styles.modeText, item.text !== mode.text && styles.deactiveModeText]}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Component
          navigation={navigation}
          selectable={selectable}
          selectedPrivacy={selectedPrivacy}
          account={account}
          wallet={wallet}
          reloading={reloading}
        />
        <KeepAwake />
      </View>
    </View>
  );
};

SendCoin.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default SendCoin;
