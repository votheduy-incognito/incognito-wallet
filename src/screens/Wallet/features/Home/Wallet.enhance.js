import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { useSelector, useDispatch } from 'react-redux';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import { getPTokenList, getInternalTokenList } from '@src/redux/actions/token';
import {
  getBalance,
  reloadAccountFollowingToken,
} from '@src/redux/actions/account';
import storageService from '@src/services/storage';
import { CONSTANT_KEYS, CONSTANT_COMMONS } from '@src/constants';
import { countFollowToken } from '@src/services/api/token';
import { useNavigation } from 'react-navigation-hooks';
import {
  setSelectedPrivacy,
  clearSelectedPrivacy,
} from '@src/redux/actions/selectedPrivacy';
import routeNames from '@src/router/routeNames';
import { actionRemoveFollowToken } from '@src/redux/actions';
import { Toast } from '@src/components/core';
import { InteractionManager } from 'react-native';
import { actionInit as actionInitEstimateFee } from '@components/EstimateFee/EstimateFee.actions';

export const WalletContext = React.createContext({});

const enhance = WrappedComp => props => {
  const account = useSelector(accountSeleclor.defaultAccount);
  const tokens = useSelector(tokenSeleclor.tokensFollowedSelector);
  const wallet = useSelector(state => state?.wallet);
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    isReloading: false,
  });
  const { isReloading } = state;
  const navigation = useNavigation();
  const getAccountBalance = async () => {
    try {
      await dispatch(getBalance(account));
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, {
        rawError: e,
      });
    }
  };
  const getFollowingToken = async () => {
    try {
      await setState({ isReloading: true });
      await dispatch(
        reloadAccountFollowingToken(account, {
          shouldLoadBalance: true,
        }),
      );
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, {
        rawError: e,
      });
    } finally {
      await setState({ isReloading: false });
    }
  };
  const fetchData = async (reload = false) => {
    try {
      await setState({ isReloading: true });
      let tasks = [
        getAccountBalance(),
        getFollowingToken(),
        handleCountFollowedToken(),
      ];
      if (reload) {
        tasks = [
          ...tasks,
          await dispatch(getPTokenList()),
          await dispatch(getInternalTokenList()),
        ];
      }
      await Promise.all(tasks);
    } catch (error) {
      new ExHandler(error).showErrorToast();
    } finally {
      await setState({ isReloading: false });
    }
  };
  const handleCountFollowedToken = async () => {
    try {
      const isChecked = !!JSON.parse(
        await storageService.getItem(CONSTANT_KEYS.IS_CHECK_FOLLOWED_TOKEN),
      );
      const tokenIds = tokens.map(t => t.id);
      if (!isChecked) {
        countFollowToken(tokenIds, account?.PublicKey).catch(null);
        storageService.setItem(
          CONSTANT_KEYS.IS_CHECK_FOLLOWED_TOKEN,
          JSON.stringify(true),
        );
      }
    } catch (e) {
      new ExHandler(e);
    }
  };
  const handleExportKey = async () => {
    navigation.navigate(routeNames.ReceiveCrypto);
    await dispatch(setSelectedPrivacy(CONSTANT_COMMONS.PRV.id));
  };
  const handleSelectToken = async tokenId => {
    if (!tokenId) return;
    await dispatch(setSelectedPrivacy(tokenId));
    navigation.navigate(routeNames.WalletDetail);
  };
  const clearWallet = async () =>
    await new Promise.all([
      dispatch(actionInitEstimateFee()),
      dispatch(clearSelectedPrivacy()),
    ]);
  const handleRemoveToken = async tokenId => {
    await dispatch(actionRemoveFollowToken(tokenId));
    Toast.showSuccess('Add coin again to restore balance.', {
      duration: 1000,
    });
  };
  return (
    <ErrorBoundary>
      <WalletContext.Provider
        value={{
          walletProps: {
            ...props,
            wallet,
            isReloading,
            fetchData,
            handleExportKey,
            handleSelectToken,
            handleRemoveToken,
            clearWallet,
            getFollowingToken,
          },
        }}
      >
        <WrappedComp
          {...{
            ...props,
            wallet,
            isReloading,
            fetchData,
            handleExportKey,
            handleSelectToken,
            handleRemoveToken,
            clearWallet,
            getFollowingToken,
          }}
        />
      </WalletContext.Provider>
    </ErrorBoundary>
  );
};

const enhanceInteractionManager = WrappedComponent => props => {
  const [state, setState] = React.useState({
    mounted: false,
  });
  const { mounted } = state;
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setState({ ...state, mounted: true });
    });
  }, []);
  if (!mounted) {
    return null;
  }
  return <WrappedComponent {...props} />;
};

export default compose(
  enhanceInteractionManager,
  enhance,
);
