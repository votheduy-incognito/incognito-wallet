import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Image,
  Text, TouchableOpacity,
  View,
} from '@src/components/core';
import downArrow from '@src/assets/images/icons/down_arrow.png';
import { RefreshControl, ScrollView } from 'react-native';
import accountService from '@services/wallet/accountService';
import tokenService from '@services/wallet/tokenService';
import { getTokenList } from '@src/services/api/token';
import {
  getPDEPairs,
} from '@src/services/wallet/RpcClientService';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import { ExHandler } from '@services/exception';
import { Divider } from 'react-native-elements';
import dexUtils, { DEX } from '@src/utils/dex';
import ExchangeRate from '@screens/Dex/components/ExchangeRate';
import LocalDatabase from '@utils/LocalDatabase';
import FullScreenLoading from '@components/FullScreenLoading/index';
import routeNames from '@routers/routeNames';
import {TradeHistory} from '@models/dexHistory';
import SwapSuccessDialog from './components/SwapSuccessDialog';
import Transfer from './Transfer';
import Input from './Input';
import {PRV, MESSAGES, MIN_INPUT} from './constants';
import { mainStyle } from './style';
import { CHAIN_PAIRS, CHAIN_TOKENS } from './mock_data';
import TradeConfirm from './components/TradeConfirm';

class Swap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputToken: undefined,
      inputValue: undefined,
      outputToken: undefined,
      outputValue: undefined,
      outputList: [],
      balance: 'Loading',
      prvBalance: 0,
      inputError: undefined,
      chainPairs: [],
      tokens: [],
      dexMainAccount: {},
      accounts: [],
      showSwapSuccess: false,
      showTradeConfirm: false,
      sending: false,
    };

    this.interval = null;
    this.listener = null;
  }

  async componentDidMount() {
    const { navigation } = this.props;
    this.seenDepositGuide = await LocalDatabase.getSeenDepositGuide() || false;
    await this.createAccounts();
    this.loadData();

    this.listener = navigation.addListener('didFocus', this.loadData);
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  async updateSeenDepositGuide() {
    this.seenDepositGuide = true;
    await LocalDatabase.saveSeenDepositGuide(this.seenDepositGuide);
    const { onShowDepositGuide } = this.props;
    onShowDepositGuide();
  }

  async createAccounts() {
    const { wallet } = this.props;
    const accounts = await wallet.listAccount();
    const dexMainAccount = accounts.find(item => item.AccountName === DEX.MAIN_ACCOUNT);
    const dexWithdrawAccount = accounts.find(item => item.AccountName === DEX.WITHDRAW_ACCOUNT);
    this.setState({ dexMainAccount, dexWithdrawAccount });
  }

  loadData = async () => {
    const { wallet } = this.props;
    const { inputToken, isLoading } = this.state;

    if (isLoading) {
      return;
    }

    try {
      let accounts = await wallet.listAccount();
      accounts = accounts.filter(account => !dexUtils.isDEXAccount(account.name || account.AccountName));
      this.setState( { accounts });

      this.setState({ isLoading: true });
      const pTokens = await getTokenList();
      const pairs = await getPDEPairs();
      const chainTokens = await tokenService.getPrivacyTokens();
      // const pairs = CHAIN_PAIRS;
      // const chainTokens = CHAIN_TOKENS;

      const chainPairs = _.map(pairs.state.PDEPoolPairs, pair => ({
        [pair.Token1IDStr]: pair.Token1PoolValue,
        [pair.Token2IDStr]: pair.Token2PoolValue,
      })).filter(pair => _.every(pair, value => value > 0));
      const tokens = [PRV, ..._.orderBy(chainTokens
        .filter(token => chainPairs.find(pair => Object.keys(pair).includes(token.id)))
        .map(item => {
          const pToken = pTokens.find(token => token.tokenId === item.id);
          return {
            ...item,
            pDecimals: Math.min(pToken?.pDecimals || 0, 9),
            hasIcon: !!pToken,
            symbol: pToken?.symbol || item.symbol,
            name: pToken?.name || item.name,
          };
        })
        .filter(token => token.name && token.symbol), item => item.symbol && item.symbol.toLowerCase())];

      this.setState({ chainPairs, tokens, inputToken: inputToken || tokens[0] }, () => {
        this.filterOutputList();
        this.getInputBalance();
      });
    } catch(error) {
      new ExHandler(error).showErrorToast();
    } finally {
      this.setState({ isLoading: false });
    }
  };

  async getInputBalance() {
    const { wallet } = this.props;
    const { inputToken: token, dexMainAccount } = this.state;
    const balance = await accountService.getBalance(dexMainAccount, wallet, token.id);
    let prvBalance = balance;

    if (token !== PRV) {
      prvBalance = await accountService.getBalance(dexMainAccount, wallet);
    }

    this.setState({ balance, prvBalance });
  }

  selectInput = (token) => {
    this.inputRef.clear();

    this.setState({
      inputToken: token,
      inputValue: 0,
      outputToken: null,
      outputValue: null,
      inputError: null,
      balance: 'Loading',
    }, () => {
      this.filterOutputList();
      this.getInputBalance();
    });
  };

  selectOutput = (token) => {
    this.setState({ outputToken: token }, this.calculateOutputValue);
  };

  changeInputValue = (newValue) => {
    const {balance, inputToken} = this.state;
    let number = _.toNumber(newValue);

    if (_.isNaN(number)) {
      this.setState({inputError: MESSAGES.MUST_BE_NUMBER });
    } else {
      number = _.toNumber(convertUtil.toOriginalAmount(number, inputToken.pDecimals));
      if (number < MIN_INPUT) {
        this.setState({
          inputError: MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, inputToken.pDecimals),
          inputValue: 0,
        }, this.calculateOutputValue);
      } else if (number > balance) {
        this.setState({
          inputError: MESSAGES.BALANCE_INSUFFICIENT,
          inputValue: number,
        }, this.calculateOutputValue);
      } else {
        this.setState({ inputError: null });
        this.setState({ inputValue: number }, this.calculateOutputValue);
      }
    }
  };

  async filterOutputList() {
    const { inputToken: token, chainPairs, tokens, outputToken } = this.state;

    const pairs = chainPairs
      .filter(pair => Object.keys(pair).includes(token.id));
    const outputList = _.orderBy(
      pairs
        .map(pair => Object.keys(pair).find(key => key !== token.id))
        .map(id => tokens.find(token => token.id.includes(id)))
        .filter(item => item)
      , item => item.symbol && item.symbol.toLowerCase());

    this.setState({
      pairs,
      outputList,
      outputToken: outputToken || outputList[0],
    }, this.calculateOutputValue);
  }

  calculateOutputValue() {
    const { pairs, outputToken, inputToken, inputValue } = this.state;

    if (!outputToken || !_.isNumber(inputValue) || _.isNaN(inputValue)) {
      return this.setState({ outputValue: 0 });
    }

    const pair = pairs.find(i => Object.keys(i).includes(outputToken.id));
    const inputPool = pair[inputToken.id];
    const outputPool = pair[outputToken.id];
    const initialPool = inputPool * outputPool;
    const newInputPool = inputPool + inputValue - 0;
    const newOutputPoolWithFee = _.ceil(initialPool / newInputPool);
    const outputValue = outputPool - newOutputPoolWithFee;
    this.setState({ outputValue });
  }

  async tradePToken(account, tradingFee, networkFee, networkFeeUnit, stopPrice) {
    const { wallet } = this.props;
    const { inputToken, outputToken, inputValue } = this.state;

    const tokenParams = {
      Privacy: true,
      TokenID: inputToken.id,
      TokenName: inputToken.name,
      TokenSymbol: inputToken.symbol,
    };

    console.debug('TRADE TOKEN', tradingFee, networkFee, networkFeeUnit, stopPrice, inputToken.symbol, outputToken.symbol, inputValue);

    if (inputToken === PRV) {
      return accountService.createAndSendNativeTokenTradeRequestTx(
        wallet,
        account,
        networkFee,
        outputToken.id,
        inputValue,
        stopPrice,
        tradingFee);
    } else {
      const prvFee = networkFeeUnit === PRV.symbol ? networkFee : 0;
      const tokenFee = networkFeeUnit !== PRV.symbol ? networkFee : 0;
      return accountService.createAndSendPTokenTradeRequestTx(wallet, account, tokenParams, prvFee, tokenFee, outputToken.id, inputValue, stopPrice, tradingFee);
    }
  }

  trade = async (networkFee, networkFeeUnit, tradingFee, stopPrice) => {
    const { wallet } = this.props;
    const { sending, dexMainAccount, balance, inputToken, inputValue } = this.state;
    let prvBalance;
    let prvFee = 0;
    let tokenFee = 0;
    if (sending) {
      return;
    }

    this.setState({ sending: true, tradeError: null });
    let result;

    try {
      if (inputToken === PRV) {
        prvFee = networkFee;
        prvBalance = balance;
        tokenFee = prvFee;
      } else {
        prvFee = networkFeeUnit === PRV.symbol ? networkFee : 0;
        tokenFee = prvFee > 0 ? 0 : networkFee;
        if (prvFee > 0) {
          prvBalance = await accountService.getBalance(dexMainAccount, wallet);
        }
      }

      if (balance < inputValue + tradingFee + tokenFee) {
        return this.setState({ tradeError: MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol) });
      }

      if (prvBalance < prvFee) {
        return this.setState({ tradeError: MESSAGES.NOT_ENOUGH_NETWORK_FEE });
      }

      result = await this.tradePToken(dexMainAccount, tradingFee, networkFee, networkFeeUnit, stopPrice);
      if (result && result.txId) {
        const { onAddHistory } = this.props;
        const { outputValue, outputToken } = this.state;
        this.setState({ showSwapSuccess: true, showTradeConfirm: false });
        onAddHistory(new TradeHistory(result, inputToken, outputToken, inputValue, outputValue, networkFee, networkFeeUnit, tradingFee, stopPrice));
        await this.loadData();
      }
    } catch (error) {
      this.setState({ tradeError: MESSAGES.TRADE_ERROR });
    } finally {
      this.setState({ sending: false });
    }
  };

  goToHistory = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.DexHistory);
  };

  swap = async () => {
    const { inputError } = this.state;

    if (inputError === MESSAGES.BALANCE_INSUFFICIENT && !this.seenDepositGuide) {
      return this.updateSeenDepositGuide();
    }
    this.setState({ showTradeConfirm: true });
  };

  handleRef = (ref) => {
    this.inputRef = ref;
  };

  closeSuccessDialog = () => {
    this.setState({
      showSwapSuccess: false,
      inputValue: 0,
      outputValue: 0,
    });
    this.inputRef.clear();
  };

  renderFee() {
    const {
      inputToken,
      inputValue,
      outputToken,
      outputValue,
    } = this.state;

    if (
      !outputToken ||
      !outputValue ||
      !_.isNumber(outputValue) ||
      !inputValue || !_.isNumber(inputValue)
    ) {
      return null;
    }

    return (
      <View style={mainStyle.feeWrapper}>
        <ExchangeRate
          inputToken={inputToken}
          inputValue={inputValue}
          outputToken={outputToken}
          outputValue={outputValue}
        />
      </View>
    );
  }

  renderInputs() {
    const { wallet } = this.props;
    const {
      inputToken,
      inputValue,
      outputToken,
      outputValue,
      outputList,
      balance,
      tokens,
      inputError,
      dexMainAccount,
    } = this.state;
    return (
      <View>
        <Input
          tokenList={tokens}
          onSelectToken={this.selectInput}
          onChange={this.changeInputValue}
          headerTitle="From"
          balance={balance}
          token={inputToken}
          value={inputValue}
          onRef={this.handleRef}
          account={dexMainAccount}
          wallet={wallet}
        />
        {!!inputError && (inputError !== MESSAGES.BALANCE_INSUFFICIENT || this.seenDepositGuide) && (
          <Text style={mainStyle.error}>
            {inputError}
          </Text>
        )}
        <View style={mainStyle.arrowWrapper}>
          <Divider style={mainStyle.divider} />
          <Image source={downArrow} style={mainStyle.arrow} />
          <Divider style={mainStyle.divider} />
        </View>
        <Input
          tokenList={outputList}
          onSelectToken={this.selectOutput}
          headerTitle="To (estimated)"
          token={outputToken}
          account={dexMainAccount}
          wallet={wallet}
          value={_.isNumber(outputValue) ? formatUtil.amountFull(outputValue, outputToken?.pDecimals) : '0'}
        />
      </View>
    );
  }

  render() {
    const {
      outputValue,
      sending,
      isLoading,
      dexMainAccount,
      dexWithdrawAccount,
      accounts,
      tokens,
      inputToken,
      inputValue,
      outputToken,
      showSwapSuccess,
      showTradeConfirm,
      tradeError,
      balance,
      prvBalance,
    } = this.state;
    const { wallet, transferAction, onClosePopUp, histories, onAddHistory, onUpdateHistory } = this.props;
    let { inputError } = this.state;

    if (inputError === MESSAGES.BALANCE_INSUFFICIENT && !this.seenDepositGuide) {
      inputError = null;
    }

    return (
      <View style={mainStyle.componentWrapper}>
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={this.loadData} />}>
          <View style={mainStyle.scrollView}>
            <View style={mainStyle.content}>
              {this.renderInputs()}
              <View style={mainStyle.dottedDivider} />
              {this.renderFee()}
            </View>
            <Transfer
              dexMainAccount={dexMainAccount}
              dexWithdrawAccount={dexWithdrawAccount}
              wallet={wallet}
              accounts={accounts}
              tokens={tokens}
              action={transferAction}
              onClosePopUp={onClosePopUp}
              inputToken={inputToken}
              onLoadData={this.loadData}
              onAddHistory={onAddHistory}
              onUpdateHistory={onUpdateHistory}
            />
            <View style={[mainStyle.actionsWrapper]}>
              <Button
                title="Trade"
                style={[mainStyle.button]}
                disabled={
                  sending ||
                  inputError ||
                  !outputValue ||
                  outputValue <= 0
                }
                disabledStyle={mainStyle.disabledButton}
                onPress={this.swap}
              />
              {histories?.length > 0 && (
                <TouchableOpacity onPress={this.goToHistory}>
                  <Text style={mainStyle.viewHistoryText}>View trade history</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <FullScreenLoading open={sending} />
          <SwapSuccessDialog
            inputToken={inputToken}
            inputValue={inputValue}
            outputToken={outputToken}
            outputValue={outputValue}
            showSwapSuccess={showSwapSuccess}
            closeSuccessDialog={this.closeSuccessDialog}
          />
          <TradeConfirm
            visible={showTradeConfirm}
            account={dexMainAccount}
            wallet={wallet}
            inputToken={inputToken || {}}
            inputValue={inputValue}
            outputToken={outputToken || {}}
            outputValue={outputValue}
            onClose={() => this.setState({ showTradeConfirm: false, tradeError: null })}
            onTrade={this.trade}
            tradeError={tradeError}
            sending={sending}
            inputBalance={balance}
            prvBalance={prvBalance}
          />
        </ScrollView>
        {/*<WithdrawalInProgress />*/}
      </View>
    );
  }
}

Swap.defaultProps = {
  transferAction: null,
};

Swap.propTypes = {
  histories: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onClosePopUp: PropTypes.func.isRequired,
  transferAction: PropTypes.string,
  onShowPopUp: PropTypes.func.isRequired,
  onShowDepositGuide: PropTypes.func.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onUpdateHistory: PropTypes.func.isRequired,
};

export default Swap;
