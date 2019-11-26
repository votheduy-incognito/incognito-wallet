import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { View } from '@components/core';
import HeaderBar from '@components/HeaderBar/HeaderBar';
import {COLORS} from '@src/styles';
import {MESSAGES, PRV, SHORT_WAIT_TIME, MAX_WAITING_TIME} from '@screens/Dex/constants';
import {CONSTANT_COMMONS} from '@src/constants';
import tokenService from '@services/wallet/tokenService';
import accountService from '@services/wallet/accountService';
import Toast from '@components/core/Toast/Toast';
import {ExHandler} from '@services/exception';
import {DEX} from '@utils/dex';
import {updateHistory, getHistoryStatus} from '@src/redux/actions/dex';
import {connect} from 'react-redux';
import TradeHistory from './TradeHistory';
import WithdrawHistory from './WithdrawHistory';
import DepositHistory from './DepositHistory';

const MAX_TRIED = MAX_WAITING_TIME / SHORT_WAIT_TIME;

const options = {
  title: 'Transaction details',
  headerBackground: COLORS.dark2,
};

const HISTORY_TYPES = {
  [MESSAGES.DEPOSIT]: DepositHistory,
  [MESSAGES.WITHDRAW]: WithdrawHistory,
  [MESSAGES.TRADE]: TradeHistory,
};

let currentInterval;

const sendPToken = (wallet, fromAccount, toAccount, token, amount, paymentInfo, prvFee = 0, tokenFee = 0) => {
  const tokenObject = {
    Privacy: true,
    TokenID: token.id,
    TokenName: token.name,
    TokenSymbol: token.symbol,
    TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
    TokenAmount: amount,
    TokenReceivers: {
      PaymentAddress: toAccount.PaymentAddress,
      Amount: amount
    }
  };

  console.debug('SEND PTOKEN', tokenObject, amount, prvFee, tokenFee, fromAccount.AccountName);

  return tokenService.createSendPToken(
    tokenObject,
    prvFee,
    fromAccount,
    wallet,
    paymentInfo,
    tokenFee,
  );
};

const sendPRV = async (wallet, fromAccount, toAccount, amount, prvFee = 0) => {
  const paymentInfos = [{
    paymentAddressStr: toAccount.PaymentAddress,
    amount: amount
  }];

  console.debug('SEND PRV', paymentInfos, amount, prvFee, fromAccount.AccountName);

  return accountService.createAndSendNativeToken(paymentInfos, prvFee, true, fromAccount, wallet);
};

const waitUntil = (func, ms) => {
  return new Promise((resolve, reject) => {
    currentInterval = setInterval(func.bind(this, resolve, reject), ms);
  });
};

const checkCorrectBalance = (wallet, account, token, value) => {
  let tried = 0;
  return async (resolve, reject) => {
    const balance = await accountService.getBalance(account, wallet, token.id);
    if (balance >= value) {
      clearInterval(currentInterval);
      return resolve(balance);
    }

    if (tried++ > MAX_TRIED) {
      reject(MESSAGES.SOMETHING_WRONG);
    }
  };
};

const DexHistoryDetail = ({ navigation, wallet, updateHistory, getHistoryStatus }) => {
  const { params } = navigation.state;
  const { history } = params;
  const [loading, setLoading] = React.useState(false);
  const History = HISTORY_TYPES[history.type];

  const continueWithdraw = async () => {
    if (loading) {
      return;
    }


    try {
      WithdrawHistory.currentWithdraw = history;
      setLoading(true);
      const accounts = await wallet.listAccount();
      const dexWithdrawAccount = accounts.find(item => item.AccountName === DEX.WITHDRAW_ACCOUNT);
      const { tokenId, amount, networkFee, networkFeeUnit, pDecimals, paymentAddress, account: accountName, tokenSymbol, tokenName } = history;
      const token = { id: tokenId, symbol: tokenSymbol, pDecimals, name: tokenName || '' };
      const account = { AccountName: accountName, PaymentAddress: paymentAddress };
      const fee = _.floor(networkFee / 2, 0);
      let res;
      if (token.id === PRV.id) {
        console.debug('CONTINUE STEP PRV');
        await waitUntil(checkCorrectBalance(wallet, dexWithdrawAccount, PRV, amount + fee), SHORT_WAIT_TIME);
        res = await sendPRV(wallet, dexWithdrawAccount, account, amount, fee);
      } else {
        console.debug('CONTINUE STEP TOKEN');
        const tokenFee = networkFeeUnit !== PRV.symbol ? fee : 0;
        await waitUntil(checkCorrectBalance(wallet, dexWithdrawAccount, token, amount + tokenFee), SHORT_WAIT_TIME);
        res = await sendPToken(wallet, dexWithdrawAccount, account, token, amount, null, tokenFee ? 0 : fee, tokenFee);
      }

      history.updateTx2(res);
      WithdrawHistory.currentWithdraw = null;
      updateHistory(history);
      await getHistoryStatus(history);
      Toast.showSuccess(MESSAGES.WITHDRAW_COMPLETED);
    } catch (error) {
      const e = error;
      console.debug('CONTINUE FAILED', e);
      WithdrawHistory.currentWithdraw = null;
      updateHistory(history);
      new ExHandler(error).showErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return(
    <View>
      <HeaderBar
        index={2}
        navigation={navigation}
        scene={{ descriptor: { options } }}
      />
      <History {...history} onContinue={continueWithdraw} loading={loading} />
    </View>
  );
};

const mapState = state => ({
  wallet: state.wallet,
});

const mapDispatch = {
  updateHistory,
  getHistoryStatus,
};


DexHistoryDetail.propTypes = {
  wallet: PropTypes.object.isRequired,
  updateHistory: PropTypes.func.isRequired,
  getHistoryStatus: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        history: PropTypes.object.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(DexHistoryDetail);
