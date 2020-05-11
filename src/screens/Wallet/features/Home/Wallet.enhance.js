import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useSelector, useDispatch } from 'react-redux';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import {
  getInternalTokenList,
  getPTokenList,
  actionGetExchangeRate,
} from '@src/redux/actions/token';
import {
  getBalance,
  reloadAccountFollowingToken,
} from '@src/redux/actions/account';
import storageService from '@src/services/storage';
import { CONSTANT_KEYS } from '@src/constants';
import { countFollowToken } from '@src/services/api/token';
import withFCM from '@src/screens/Notification/Notification.withFCM';
import { actionToggleModal } from '@src/components/Modal';
import ExportKey from '@src/components/ExportKey';
import { useNavigation, useIsFocused } from 'react-navigation-hooks';
import {
  setSelectedPrivacy,
  clearSelectedPrivacy,
} from '@src/redux/actions/selectedPrivacy';
import routeNames from '@src/router/routeNames';

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
  const isFocused = useIsFocused();
  const getTokens = async () => {
    try {
      await new Promise.all([
        await dispatch(getPTokenList()),
        await dispatch(getInternalTokenList()),
      ]);
    } catch (e) {
      new ExHandler(
        e,
        'Sorry, we can not get list of tokens, reopen the app can fix it.',
      );
    }
  };
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
      await dispatch(
        reloadAccountFollowingToken(account, {
          shouldLoadBalance: true,
        }),
      );
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, {
        rawError: e,
      });
    }
  };
  const getExchangeRate = async () => {
    try {
      await dispatch(actionGetExchangeRate());
    } catch (error) {
      throw Error(error);
    }
  };
  const reload = async () => {
    try {
      setState({ isReloading: true });
      const tasks = [
        getTokens(),
        getAccountBalance(),
        getFollowingToken(),
        getExchangeRate(),
      ];
      await Promise.all(tasks);
    } catch (e) {
      new ExHandler(e).showErrorToast();
    } finally {
      setState({ isReloading: false });
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
    await dispatch(
      actionToggleModal({
        data: (
          <ExportKey
            title="YOUR INCOGNITO ADDRESS"
            keyExported={account?.PaymentAddress}
            onPressExportKey={() => dispatch(actionToggleModal())}
          />
        ),
        visible: true,
        shouldCloseModalWhenTapOverlay: true,
      }),
    );
  };
  const handleSelectToken = async tokenId => {
    if (!tokenId) return;
    await dispatch(setSelectedPrivacy(tokenId));
    navigation.navigate(routeNames.WalletDetail);
  };
  React.useEffect(() => {
    if (isFocused && wallet) {
      reload();
      handleCountFollowedToken();
      dispatch(clearSelectedPrivacy());
    }
  }, [wallet, isFocused]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          isReloading,
          reload,
          handleExportKey,
          handleSelectToken,
        }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withFCM,
  withLayout_2,
  enhance,
);
