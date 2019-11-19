import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Image,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from '@src/components/core';
import { ScrollView, TextInput as ReactInput } from 'react-native';
import accountService from '@services/wallet/accountService';
import { isExchangeRatePToken } from '@src/services/wallet/RpcClientService';
import {CONSTANT_COMMONS} from '@src/constants';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import {ExHandler} from '@services/exception';
import {Icon, Overlay} from 'react-native-elements';
import {COLORS} from '@src/styles';
import accountIcon from '@src/assets/images/icons/account_icon.png';
import leftArrow from '@src/assets/images/icons/left_arrow.png';
import CryptoIcon from '@components/CryptoIcon/index';
import EstimateFee from '@components/EstimateFee';
import FullScreenLoading from '@components/FullScreenLoading/index';
import TransferSuccessPopUp from './components/TransferSuccessPopUp';
import {PRV, WAIT_TIME, MESSAGES, MIN_INPUT} from './constants';
import { mainStyle, tokenStyle } from './style';

class Transfer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      transfer: {},
      tokenBalances: {},
      balances: [],
      sending: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { action, inputToken } = this.props;

    if (action && action !== prevProps.action) {
      if (inputToken && action === 'deposit') {
        this.selectToken(inputToken);
      } else if (action === 'withdraw') {
        this.getDexBalances();
      }
    }
  }

  updateTransfer(newTransfer, cb) {
    const { transfer } = this.state;
    this.setState({ transfer: {...transfer, ...newTransfer} }, cb);
  }

  async deposit({ token, amount, account, fee, feeUnit }) {
    const { sendPRV, sendPToken, dexMainAccount } = this.props;
    if (token === PRV) {
      await sendPRV(account, dexMainAccount, amount, fee);
    } else {
      await sendPToken(account, dexMainAccount, token, amount, null, feeUnit === PRV.symbol ? fee : 0, feeUnit !== PRV.symbol ? fee : 0);
    }
  }

  async withdraw({token, amount, account, fee: rawFee}) {
    const { sendPRV, sendPToken, dexMainAccount, dexWithdrawAccount, waitUntil, checkCorrectBalance } = this.props;
    const fee = rawFee / 2;

    if (token === PRV) {
      console.debug('WITHDRAW STEP 1', amount, fee, amount + fee, rawFee);
      await sendPRV(dexMainAccount, dexWithdrawAccount, amount + fee, fee);
      await waitUntil(checkCorrectBalance(dexWithdrawAccount, PRV, amount + fee), WAIT_TIME);
      console.debug('WITHDRAW STEP 2', amount, fee);
      await sendPRV(dexWithdrawAccount, account, amount, fee);
    } else {
      const { transfer } = this.state;
      const { feeUnit, fee } = transfer;
      const paymentInfo = feeUnit === PRV.symbol ? {
        paymentAddressStr: dexWithdrawAccount.PaymentAddress,
        amount: fee,
      } : null;
      const tokenFee = feeUnit !== PRV.symbol ? fee : 0;
      console.debug('WITHDRAW PTOKEN STEP 1', amount, fee, amount + fee);
      await sendPToken(dexMainAccount, dexWithdrawAccount, token, amount + tokenFee, paymentInfo, tokenFee ? 0 : fee, tokenFee);
      await waitUntil(checkCorrectBalance(dexWithdrawAccount, token, amount + tokenFee), WAIT_TIME);
      console.debug('WITHDRAW PTOKEN STEP 2', amount, fee);
      await sendPToken(dexWithdrawAccount, account, token, amount, null, tokenFee ? 0 : fee, tokenFee);
    }
  }

  transfer = async () => {
    const { onLoadData } = this.props;
    const { transfer, sending } = this.state;
    const { action, error, token, amount, account } = transfer;

    if (sending) {
      return;
    }

    if (!error && token && amount && account && !sending) {
      this.updateTransfer({ chainError: null });
      try {
        this.setState({ sending: true });
        await this[action](transfer);
        this.updateTransfer({ success: true });
        onLoadData();
      } catch (error) {
        let errorMessage = action === 'deposit' ? MESSAGES.DEPOSIT_ERROR : MESSAGES.WITHDRAW_ERROR;
        this.updateTransfer({ chainError: errorMessage });
      } finally {
        this.setState({ sending: false });
      }
    }
  };

  async getBalances(token) {
    const { accounts, wallet } = this.props;
    const balances = accounts.map(() => undefined);

    if (accounts.length === 1) {
      this.selectAccount(accounts[0]);
    } else {
      accounts.forEach((account, index) => {
        accountService.getBalance(account, wallet, token.id)
          .then(balance => {
            balances[index] = balance;
            this.setState({balances: [...balances]});
          });
      });
    }
  }

  getTokenBalance(token, wallet, account) {
    accountService.getBalance(account, wallet, token.id)
      .then(balance => {
        const { tokenBalances } = this.state;
        tokenBalances[token.id] = balance;
        this.setState({ tokenBalances: { ...tokenBalances } });
      })
      .catch((err) => console.log(err));
  }

  getDexBalances() {
    const { dexMainAccount, wallet, tokens } = this.props;
    this.setState( { tokenBalances: {} });
    tokens.forEach(token => {
      this.getTokenBalance(token, wallet, dexMainAccount);
    });
  }

  selectAccount = (account, index) => {
    const { transfer, balances } = this.state;
    const { token } = transfer;
    const { wallet, dexMainAccount } = this.props;
    if (transfer.action === 'deposit') {
      if (index === undefined) {
        this.updateTransfer({ account }, () => {
          accountService.getBalance(account, wallet, token.id)
            .then(balance => {
              this.updateTransfer({ balance });
            });
        });
      } else if (balances[index] >= 0) {
        this.updateTransfer({
          account,
          balance: balances[index],
        });
      }
    } else {
      this.updateTransfer({ account }, () => {
        accountService.getBalance(dexMainAccount, wallet, token.id)
          .then(balance => {
            this.updateTransfer({ balance });
          });
      });
    }
  };

  selectToken = async (token) => {
    const { action, accounts } = this.props;
    const { transfer } = this.state;

    transfer.token = token;
    transfer.fee = null;
    transfer.feeUnit = null;
    transfer.action = action;
    this.updateTransfer({
      token,
      fee: null,
      feeUnit: null,
      action,
    }, this.getSupportedFeeTypes.bind(this, token));

    if (transfer.action === 'deposit') {
      this.getBalances(token);
    } else if (accounts.length === 1) {
      this.selectAccount(accounts[0]);
    }
  };

  closePopUp = () => {
    const { onClosePopUp } = this.props;
    this.setState({ transfer: {} });

    onClosePopUp();
  };

  closeAccountPopUp = () => {
    this.updateTransfer({
      token: undefined,
      fee: undefined,
      feeUnit: undefined,
    });
    this.setState({balances: []});
  };

  closeAmountPopUp = () => {
    this.updateTransfer({
      account: undefined,
      chainError: null,
      error: null,
      amount: 0,
    }, () => {
      const { accounts } = this.props;
      const { transfer } = this.state;
      if (accounts.length > 1) {
        this.selectToken(transfer.token);
      } else {
        this.closeAccountPopUp();
      }
    });
  };

  changeAmount = (text) => {
    const { transfer } = this.state;
    const number = _.toNumber(text);
    let amount = transfer.amount;
    let error;

    if (!_.isNaN(number)) {
      const { balance } = transfer;
      const originalAmount = _.toNumber(convertUtil.toOriginalAmount(number, transfer.token.pDecimals));

      if (originalAmount > balance) {
        error = MESSAGES.BALANCE_INSUFFICIENT;
      } else if (originalAmount < MIN_INPUT) {
        error = `Please enter a number greater than or equal to ${formatUtil.amountFull(MIN_INPUT, transfer.token.pDecimals)}.`;
      } else {
        amount = originalAmount;
        error = null;
      }
    } else {
      error = 'Must be a number.';
    }

    this.updateTransfer({
      error,
      amount,
      chainError: null,
    });
  };

  getSupportedFeeTypes = async () => {
    const supportedFeeTypes = [{
      tokenId: CONSTANT_COMMONS.PRV_TOKEN_ID,
      symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
    }];

    try {
      const { transfer } = this.state;
      const { token } = transfer;
      const isUsed = await isExchangeRatePToken(token.id);
      isUsed && supportedFeeTypes.push({
        tokenId: token.id,
        symbol: token.symbol
      });
    } catch (e) {
      new ExHandler(e);
    } finally {
      this.updateTransfer({ supportedFeeTypes });
    }
  };

  handleSelectFee = (estimateFeeData) => {
    const { transfer } = this.state;

    const { fee, feeUnit, feeUnitByTokenId } = estimateFeeData;
    let error = transfer.error;
    const { token, amount, multiply, balance } = transfer;
    const txFee = feeUnit === token.symbol ? fee * (multiply || 1) : 0;

    if (txFee + amount > balance) {
      error = MESSAGES.BALANCE_INSUFFICIENT;
    } else if (error === MESSAGES.BALANCE_INSUFFICIENT) {
      error = null;
    }

    console.debug('SELECT FEE', estimateFeeData);

    this.updateTransfer({
      fee,
      feeUnit,
      feeUnitByTokenId,
      multiply: transfer.action === 'deposit' ? 1 : 2,
      error,
      chainError : null,
    });
  };

  renderAccountBalance(token, index) {
    const { transfer, balances } = this.state;

    if (transfer.action === 'withdraw') {
      return null;
    }

    if (balances[index] === undefined) {
      return <ActivityIndicator size="small" style={mainStyle.textRight} />;
    }

    return  (
      <View style={[mainStyle.twoColumns, mainStyle.textRight]}>
        <Text
          style={[tokenStyle.name, tokenStyle.modalName, mainStyle.textRight, mainStyle.accountBalance]}
          numberOfLines={1}
        >
          {formatUtil.amount(balances[index], token?.pDecimals)}
        </Text>
        <Text style={[tokenStyle.name, tokenStyle.modalName, mainStyle.textRight, mainStyle.accountBalance]}>
          &nbsp;{token?.symbol}
        </Text>
      </View>
    );
  }

  renderTokenBalance(token) {
    const { action } = this.props;
    const { tokenBalances } = this.state;

    if (action === 'deposit') {
      return;
    }

    if (tokenBalances[token.id] === undefined) {
      return <ActivityIndicator size="small" style={mainStyle.textRight} />;
    }

    return (
      <Text style={[mainStyle.textRight, { maxWidth: 130 }]} numberOfLines={1}>
        {formatUtil.amount(tokenBalances[token.id], token.pDecimals || 0)}
      </Text>
    );
  }

  renderAccountPopUp() {
    const { transfer } = this.state;
    const { accounts } = this.props;
    const { account, token } = transfer;

    return (
      <Overlay isVisible={!account && !!token} overlayStyle={mainStyle.modal}>
        <View>
          <View style={mainStyle.modalHeader}>
            <TouchableOpacity onPress={this.closeAccountPopUp} style={mainStyle.modalBack}>
              <Image source={leftArrow} />
            </TouchableOpacity>
            <Text style={mainStyle.modalHeaderText}>
              {transfer.action === 'deposit' ? 'Deposit from' : 'Withdraw to'}
            </Text>
            <TouchableOpacity onPress={this.closePopUp}>
              <Icon name="close" color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <ScrollView style={mainStyle.modalContent}>
            {accounts.map((item, index) => (
              <TouchableOpacity
                key={item.AccountName}
                onPress={this.selectAccount.bind(this, item, index)}
                style={[mainStyle.modalItem, index === accounts.length - 1 && mainStyle.lastItem]}
                activeOpacity={0.5}
              >
                <Image source={accountIcon} style={mainStyle.accountIcon} />
                <Text numberOfLines={1} style={mainStyle.accountName}>{item.AccountName}</Text>
                {this.renderAccountBalance(token, index)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Overlay>
    );
  }

  renderTokenPopup() {
    const { transfer } = this.state;
    const { tokens, action } = this.props;
    const { token } = transfer;

    const filteredTokens = tokens.filter(item => item.name);
    return (
      <Overlay isVisible={!!action && !token} overlayStyle={mainStyle.modal}>
        <View>
          <View style={mainStyle.modalHeader}>
            <Text style={mainStyle.modalHeaderText}>Select a token</Text>
            <TouchableOpacity onPress={this.closePopUp}>
              <Icon name="close" color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <ScrollView style={mainStyle.modalContent}>
            {filteredTokens.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => this.selectToken(item)}
                activeOpacity={0.5}
                style={[mainStyle.modalItem, index === filteredTokens.length - 1 && mainStyle.lastItem]}
              >
                <CryptoIcon symbol={item.symbol} />
                <View style={tokenStyle.info}>
                  <Text style={tokenStyle.symbol}>{item.symbol}</Text>
                  <Text style={[tokenStyle.name, tokenStyle.modalName]}>{item.name}</Text>
                </View>
                {this.renderTokenBalance(item)}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Overlay>
    );
  }

  renderAmountPopup() {
    const { transfer, sending } = this.state;
    const { dexMainAccount, dexWithdrawAccount } = this.props;
    const {
      token,
      balance,
      amount,
      action,
      success,
      supportedFeeTypes,
      fee,
      feeUnit,
      feeUnitByTokenId,
      account,
      multiply,
      chainError,
    } = transfer;
    let { error } = transfer;

    if (!error && _.isNumber(fee) && !_.isNaN(fee) && amount > balance) {
      error = MESSAGES.BALANCE_INSUFFICIENT;
    }

    return (
      <Overlay isVisible={!!account && !success} overlayStyle={mainStyle.modal}>
        <View>
          <View style={mainStyle.modalHeader}>
            <TouchableOpacity onPress={this.closeAmountPopUp} style={mainStyle.modalBack}>
              <Image source={leftArrow} />
            </TouchableOpacity>
            <Text style={[mainStyle.modalHeaderText]}>
              Amount
            </Text>
            <TouchableOpacity onPress={this.closePopUp}>
              <Icon name="close" color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <View style={[mainStyle.modalContent, mainStyle.paddingTop]}>
            <View style={[mainStyle.twoColumns, mainStyle.center, tokenStyle.wrapper, mainStyle.padding]}>
              <Text style={tokenStyle.name}>{action === 'deposit' ? 'Deposit from' : 'Withdraw to'}:</Text>
              <Text style={[mainStyle.textRight, mainStyle.longAccountName]} numberOfLines={1}>
                {transfer?.account?.AccountName}
              </Text>
            </View>
            <View style={[mainStyle.twoColumns, mainStyle.center, tokenStyle.wrapper, mainStyle.padding]}>
              <Text style={tokenStyle.name}>Balance:</Text>
              <View style={[mainStyle.textRight, mainStyle.twoColumns]}>
                { _.isNumber(balance) ?
                  (
                    <Text
                      style={[tokenStyle.symbol, mainStyle.longAccountName]}
                      numberOfLines={1}
                    >
                      {formatUtil.amountFull(balance, token?.pDecimals)}
                    </Text>
                  ) : <ActivityIndicator size="small" style={mainStyle.textRight} />
                }
                <Text>&nbsp;{token?.symbol}</Text>
              </View>
            </View>
            <ReactInput
              style={tokenStyle.input}
              placeholder="0.0"
              placeholderColor={COLORS.lightGrey1}
              keyboardType="decimal-pad"
              onChangeText={this.changeAmount}
              editable={_.isNumber(balance)}
            />
            {!!error && <Text style={[mainStyle.fee, mainStyle.error, mainStyle.center, tokenStyle.error]}>{error}</Text>}
            {!!chainError && <Text style={[mainStyle.fee, mainStyle.error, mainStyle.center, tokenStyle.error]}>{chainError}</Text>}
            <View style={mainStyle.modalEstimate}>
              {/*<EstimateFee*/}
              {/*  initialFee={0}*/}
              {/*  finalFee={fee}*/}
              {/*  onSelectFee={this.handleSelectFee}*/}
              {/*  dexAccount={action === 'deposit' ? account : dexMainAccount}*/}
              {/*  dexToken={{*/}
              {/*    ...token,*/}
              {/*    amount: balance,*/}
              {/*  }}*/}
              {/*  types={supportedFeeTypes}*/}
              {/*  amount={amount / Math.pow(10, token?.pDecimals || 0)}*/}
              {/*  toAddress={action === 'deposit' ? dexMainAccount?.PaymentAddress : dexWithdrawAccount?.PaymentAddress}*/}
              {/*  multiply={multiply || 1}*/}
              {/*/>*/}
              <EstimateFee
                accountName={action === 'deposit' ? account?.AccountName : dexMainAccount?.AccountName}
                estimateFeeData={{ feeUnit, fee, feeUnitByTokenId }}
                onNewFeeData={this.handleSelectFee}
                types={supportedFeeTypes}
                dexToken={{
                  ...token,
                  balance,
                }}
                amount={amount / Math.pow(10, token?.pDecimals || 0)}
                toAddress={action === 'deposit' ? dexMainAccount?.PaymentAddress : dexWithdrawAccount?.PaymentAddress}
                multiply={multiply || 1}
              />
            </View>
            <Button
              title={_.capitalize(action)}
              disabled={
                sending ||
                error ||
                !_.isNumber(amount) ||
                !_.isNumber(fee) ||
                !_.isNumber(balance)
              }
              style={tokenStyle.button}
              onPress={this.transfer}
            />
          </View>
        </View>
      </Overlay>
    );
  }

  render() {
    const { transfer, sending } = this.state;
    const { success, account, token, action, amount } = transfer;
    return (
      <View>
        {this.renderAccountPopUp()}
        {this.renderTokenPopup()}
        {this.renderAmountPopup()}
        <TransferSuccessPopUp
          account={account}
          action={action}
          token={token}
          amount={amount}
          success={success}
          closePopUp={this.closePopUp}
        />
        <FullScreenLoading open={sending} mainText={action === 'withdraw' ? 'Withdrawing your funds...\n\nThis may take a couple of minutes. Please do not navigate away from the app.' : ''} />
      </View>
    );
  }
}

Transfer.defaultProps = {
  action: '',
  inputToken: null,
  dexWithdrawAccount: {},
  dexMainAccount: {},
};

Transfer.propTypes = {
  dexMainAccount: PropTypes.object,
  dexWithdrawAccount: PropTypes.object,
  sendPRV: PropTypes.func.isRequired,
  sendPToken: PropTypes.func.isRequired,
  waitUntil: PropTypes.func.isRequired,
  checkCorrectBalance: PropTypes.func.isRequired,
  wallet: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  accounts: PropTypes.array.isRequired,
  action: PropTypes.string,
  inputToken: PropTypes.object,
  onClosePopUp: PropTypes.func.isRequired,
  onLoadData: PropTypes.func.isRequired,
};

export default Transfer;
