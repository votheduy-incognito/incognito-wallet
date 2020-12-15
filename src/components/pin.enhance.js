import React, { useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { useNavigation } from 'react-navigation-hooks';
import { useSelector } from 'react-redux';
import AppUpdater from '@components/AppUpdater';
import { WithdrawHistory } from '@models/dexHistory';
import routeNames from '@src/router/routeNames';
import AddPin from '@screens/AddPIN';

const withPin = (WrappedComp) => (props) => {
  const navigation = useNavigation();
  const pin = useSelector(state => state?.pin?.pin);

  const handleAppStateChange = useCallback((nextAppState) => {
    if (nextAppState === 'background') {
      AppUpdater.update();
      if (pin && !WithdrawHistory.withdrawing) {
        navigation?.navigate(routeNames.AddPin, { action: 'login' });
        AddPin.waiting = false;
      }
      if (WithdrawHistory.withdrawing) {
        AddPin.waiting = true;
      }
    }

  }, [pin]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [pin]);

  return (
    <WrappedComp
      {...{ ...props }}
    />
  );
};

export default withPin;
