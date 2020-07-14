import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import Wizard from '@screens/Wizard/Wizard';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '@src/services/auth';
import { CONSTANT_CONFIGS } from '@src/constants';
import { reloadWallet, reloadAccountList } from '@src/redux/actions/wallet';
import { followDefaultTokens } from '@src/redux/actions/account';
import { getPTokenList, getInternalTokenList } from '@src/redux/actions/token';
import { loadPin } from '@src/redux/actions/pin';
import { accountSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import { DEX } from '@src/utils/dex';
import accountService from '@src/services/wallet/accountService';
import { actionInit as initNotification } from '@src/screens/Notification';
import { actionFetch as actionFetchHomeConfigs } from '@screens/Home/Home.actions';
import { useNavigation } from 'react-navigation-hooks';
import { wizardSelector } from './GetStarted.selector';

const enhance = (WrappedComp) => (props) => {
  const { isFetching, isFetched } = useSelector(wizardSelector);
  const pin = useSelector((state) => state?.pin?.pin);
  const account = useSelector((state) => accountSeleclor.defaultAccount(state));
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [state, setState] = React.useState({
    isInitialing: true,
    isCreating: false,
    errorMsg: null,
    pTokens: [],
  });
  const { errorMsg, isInitialing, isCreating, pTokens } = state;
  const setDefaultPToken = async () => {
    try {
      if (!account) throw new Error('Missing account');
      await dispatch(followDefaultTokens(account, pTokens));
    } catch {
      // can ignore this err
    }
  };
  const handleCreateNew = async () => {
    try {
      await handleCreateWallet();
      const wallet = await dispatch(reloadWallet());
      if (wallet) {
        setDefaultPToken(wallet);
        goHome();
        return wallet;
      } else {
        throw new Error('Load new wallet failed');
      }
    } catch (e) {
      throw e;
    }
  };

  const getExistedWallet = async () => {
    try {
      const wallet = await dispatch(
        reloadWallet(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT),
      );
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

  const handleCreateWallet = async () => {
    try {
      await savePassword(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);
      // just make sure there has no existed wallet
      const wallet = await getExistedWallet();
      if (wallet) {
        throw new CustomError(
          ErrorCode.getStarted_can_not_create_wallet_on_existed,
        );
      }
      requestAnimationFrame(() => {
        return initWallet();
      });
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_create_new_wallet, {
        rawError: e,
      });
    }
  };

  const onError = (msg) => setState({ ...state, errorMsg: msg });

  const goHome = async () => {
    try {
      let isCreatedNewAccount = false;
      const wallet = await getExistedWallet();
      let accounts = await wallet.listAccount();
      if (!accounts.find((item) => item.AccountName === DEX.MAIN_ACCOUNT)) {
        const firstAccount = accounts[0];
        await accountService.createAccount(
          DEX.MAIN_ACCOUNT,
          wallet,
          accountService.parseShard(firstAccount),
        );
        isCreatedNewAccount = true;
      }
      if (!accounts.find((item) => item.AccountName === DEX.WITHDRAW_ACCOUNT)) {
        accounts = await wallet.listAccount();
        const dexMainAccount = accounts.find(
          (item) => item.AccountName === DEX.MAIN_ACCOUNT,
        );
        await accountService.createAccount(
          DEX.WITHDRAW_ACCOUNT,
          wallet,
          accountService.parseShard(dexMainAccount),
        );
        isCreatedNewAccount = true;
      }
      dispatch(initNotification());
      isCreatedNewAccount ? dispatch(reloadAccountList()) : false;
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const initApp = async () => {
    try {
      await setState({ ...state, isInitialing: true });
      dispatch(actionFetchHomeConfigs());
      dispatch(loadPin());
      login();
      dispatch(getInternalTokenList());
      let [pTokens, servers] = await new Promise.all([
        dispatch(getPTokenList()),
        serverService.get(),
      ]);
      if (!servers || servers?.length === 0) {
        await serverService.setDefaultList();
      }
      await setState({ ...state, pTokens });
      const wallet = await getExistedWallet();
      if (!wallet) {
        await setState({ ...state, isCreating: true });
        await handleCreateNew();
      }
      await goHome();
    } catch (e) {
      console.log('error here', e);
      onError(
        new ExHandler(
          e,
          'Sorry, something went wrong while opening the wallet. Please check your connection or re-install the application and try again.',
        )?.writeLog()?.message,
      );
    } finally {
      await setState({ ...state, isInitialing: false, isCreating: false });
    }
  };
  const onRetry = () => {
    initApp();
    setState({ ...state, errorMsg: null, isInitialing: true });
  };
  React.useEffect(() => {
    initApp();
  }, []);
  React.useEffect(() => {
    if (!isInitialing) {
      if (!isFetching && isFetched) {
        if (pin) {
          navigation.navigate(routeNames.AddPin, {
            action: 'login',
            redirectRoute: routeNames.Home,
          });
        } else {
          navigation.navigate(routeNames.Home);
        }
      }
    }
  }, [isFetched, isFetching, isInitialing, isCreating]);
  if (isFetching) {
    return <Wizard />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{ ...props, errorMsg, isInitialing, isCreating, onRetry }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
