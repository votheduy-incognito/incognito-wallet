import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Wizard from '@screens/Wizard';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '@src/services/auth';
import { CONSTANT_KEYS } from '@src/constants';
import { reloadWallet } from '@src/redux/actions/wallet';
import { getPTokenList, getInternalTokenList } from '@src/redux/actions/token';
import { loadPin } from '@src/redux/actions/pin';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import serverService from '@src/services/wallet/Server';
import { actionInit as initNotification } from '@src/screens/Notification';
import { actionFetch as actionFetchHomeConfigs } from '@screens/Home/Home.actions';
import { useNavigation, useFocusEffect } from 'react-navigation-hooks';
import { useMigrate } from '@src/components/UseEffect/useMigrate';
import storageService from '@src/services/storage';
import { LoadingContainer } from '@src/components/core';
import { actionFetch as actionFetchProfile } from '@screens/Profile';
import { KEYS } from '@src/constants/keys';
import { getFunctionConfigs } from '@services/api/misc';
import { loadAllMasterKeyAccounts, loadAllMasterKeys } from '@src/redux/actions/masterKey';
import { masterKeysSelector } from '@src/redux/selectors/masterKey';
import Welcome from '@screens/GetStarted/Welcome';
import withPin from '@components/pin.enhance';
import {
  wizardSelector,
  isFollowedDefaultPTokensSelector,
} from './GetStarted.selector';
import {
  actionToggleShowWizard,
  actionToggleFollowDefaultPTokens,
} from './GetStarted.actions';

const enhance = (WrappedComp) => (props) => {
  const [loadMasterKeys, setLoadMasterKeys] = useState(false);
  const { isFetching, isFetched } = useSelector(wizardSelector);
  const pin = useSelector((state) => state?.pin?.pin);
  const isFollowedDefaultPTokensMainnet = useSelector(
    isFollowedDefaultPTokensSelector,
  );
  const masterKeys = useSelector(masterKeysSelector);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const initialState = {
    isInitialing: true,
    isCreating: false,
    errorMsg: null,
  };
  const [state, setState] = React.useState({
    ...initialState,
  });
  const { errorMsg, isInitialing, isCreating } = state;

  const handleMigrateWizard = async () => {
    try {
      if (!isFetching && isFetched) {
        return;
      }
      const isDisplayed = await storageService.getItem(
        CONSTANT_KEYS.DISPLAYED_WIZARD,
      );
      if (isDisplayed) {
        await dispatch(actionToggleShowWizard({ isFetched: !!isDisplayed }));
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const handleMigrateFollowToken = async () => {
    try {
      if (isFollowedDefaultPTokensMainnet) {
        await dispatch(
          actionToggleFollowDefaultPTokens({
            keySave: KEYS.IS_FOLLOW_DEFAULT_PTOKENS,
          }),
        );
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const getDataWillMigrate = async () => {
    try {
      await new Promise.all([
        handleMigrateWizard(),
        handleMigrateFollowToken(),
      ]);
    } catch (error) {
      console.debug(error);
    }
  };

  const { isFetching: isMigrating, isFetched: isMigrated } = useMigrate({
    getDataWillMigrate,
  });

  const getExistedWallet = async () => {
    try {
      const wallet = await dispatch(reloadWallet());
      if (wallet) {
        return wallet;
      }
      return null;
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_load_existed_wallet, {
        rawError: e,
      });
    }
  };

  const goHome = async () => {
    try {
      dispatch(initNotification());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const checkWallet = async () => {
    const wallet = await getExistedWallet();
    await goHome({ wallet });
  };

  const initApp = async () => {
    let errorMessage = null;
    try {
      await dispatch(loadAllMasterKeyAccounts());
      await setState({ ...initialState, isInitialing: true });
      await login();
      dispatch(actionFetchHomeConfigs());
      dispatch(getInternalTokenList());
      const [servers] = await new Promise.all([
        serverService.get(),
        dispatch(actionFetchProfile()),
        getFunctionConfigs().catch(e => e),
      ]);
      if (!servers || servers?.length === 0) {
        await serverService.setDefaultList();
      }
      await checkWallet();
    } catch (e) {
      errorMessage = new ExHandler(
        e,
        'Something\'s not quite right. Please make sure you\'re connected to the internet.\n' +
        '\n' +
        'If your connection is strong but the app still won\'t load, please contact us at go@incognito.org.\n',
      )?.writeLog()?.message;
    } finally {
      await setState({
        ...state,
        isInitialing: false,
        isCreating: false,
        errorMsg: errorMessage,
      });
    }
  };

  React.useEffect(() => {
    requestAnimationFrame(async () => {
      await dispatch(loadPin());
      await dispatch(getPTokenList());
      await dispatch(loadAllMasterKeys());
      setLoadMasterKeys(true);
    });
  }, []);

  React.useEffect(() => {
    if (!masterKeys || !loadMasterKeys || isFetching) {
      return;
    }

    if (masterKeys.length) {
      initApp();
    }
  }, [masterKeys, loadMasterKeys, isFetching]);

  useFocusEffect(
    React.useCallback(() => {
      if (
        masterKeys?.length > 0 &&
        !isInitialing && //init app success
        !isCreating && //created wallet
        isMigrated && //migrate old data success
        isFetched && //finish splash screen
        !errorMsg //no error
      ) {
        navigation.navigate(routeNames.Home);
      }
    }, [masterKeys, isInitialing, isCreating, isMigrated, isFetched, errorMsg]),
  );

  useEffect(() => {
    if (pin) {
      navigation.navigate(routeNames.AddPin, {
        action: 'login',
      });
    }
  }, [pin]);

  if (isMigrating || !loadMasterKeys) {
    return <LoadingContainer size="large" />;
  }

  if (isFetching) {
    return <Wizard />;
  }

  if (masterKeys.length === 0) {
    return <Welcome />;
  }

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{ ...props, errorMsg, isInitialing, isCreating, onRetry: initApp }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withPin,
  enhance,
);
