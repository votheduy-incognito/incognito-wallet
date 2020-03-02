import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {Button, Image, Text, TouchableOpacity, View,} from '@src/components/core';
import downArrow from '@src/assets/images/icons/down_arrow.png';
import accountService from '@services/wallet/accountService';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import {Divider} from 'react-native-elements';
import {PRV} from '@services/wallet/tokenService';
import ExchangeRate from '@screens/Dex/components/ExchangeRate';
import LocalDatabase from '@utils/LocalDatabase';
import {TradeHistory} from '@models/dexHistory';
import PoolSize from '@screens/Dex/components/PoolSize';
import {ExHandler} from '@services/exception';
import {MESSAGES, MIN_INPUT, PRIORITY_LIST} from '@screens/Dex/constants';
import {logEvent} from '@services/firebase';
import {CONSTANT_EVENTS} from '@src/constants';
import SwapSuccessDialog from '../SwapSuccessDialog';
import Input from '../Input';
import TradeConfirm from '../TradeConfirm';
import {mainStyle} from '../../style';

class Swap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.tradeParams,
      showTradeConfirm: false,
    };
  }

  async componentDidMount() {
    this.seenDepositGuide = await LocalDatabase.getSeenDepositGuide() || false;
    this.loadData();

    const { navigation } = this.props;
    this.listener = navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      if (navigation.state?.params?.inputTokenId) {
        const { pairTokens } = this.props;
        const { inputTokenId, outputTokenId, outputValue } = navigation.state.params;
        const inputToken = pairTokens.find(item => item.id === inputTokenId);
        const outputToken = pairTokens.find(item => item.id === outputTokenId);
        const inputValue = this.calculateInputValue(outputToken, outputValue, inputToken);
        this.selectInput(inputToken, convertUtil.toHumanAmount(inputValue, inputToken.pDecimals), outputToken);
      }
    });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { pairs, pairTokens, onUpdateTradeParams } = this.props;

    if (pairs.length > 0 && pairTokens.length > 0 && (pairs !== prevProps.pairs || pairTokens !== prevProps.pairTokens)) {
      this.loadData();
    }

    if (this.state !== prevState) {
      onUpdateTradeParams(prevState);
    }
  }

  loadData = () => {
    const { pairTokens } = this.props;
    const { inputToken } = this.state;

    if (!pairTokens || pairTokens.length <= 0) {
      return;
    }

    if (inputToken) {
      if (pairTokens.find(item => item.id === inputToken.id)) {
        this.filterOutputList();
        this.getInputBalance();
      } else {
        this.selectInput(pairTokens[0]);
      }
    } else {
      this.selectInput(pairTokens[0]);
    }
  };

  async updateSeenDepositGuide() {
    this.seenDepositGuide = true;
    await LocalDatabase.saveSeenDepositGuide(this.seenDepositGuide);
    const { onShowDepositGuide } = this.props;
    onShowDepositGuide();
  }

  async getInputBalance(balance) {
    const { wallet, dexMainAccount } = this.props;
    const { inputToken: token, balance: prevBalance } = this.state;
    try {
      if (!_.isNumber(balance)) {
        balance = await accountService.getBalance(dexMainAccount, wallet, token.id);
        const {inputToken} = this.state;

        if (inputToken !== token) {
          return;
        }
      }

      if (balance !== prevBalance) {
        const { inputValue, inputToken } = this.state;
        this.setState({ balance }, () => {
          const value = convertUtil.toHumanAmount(inputValue, inputToken.pDecimals);
          this.changeInputValue(formatUtil.toFixed(value, inputToken.pDecimals));
        });
      }

      let prvBalance = balance;

      if (token !== PRV) {
        prvBalance = await accountService.getBalance(dexMainAccount, wallet);
      }

      this.setState({ prvBalance });
    } catch (error) {
      console.debug('GET INPUT BALANCE ERROR', error);
    }
  }

  selectInput = (token, value = 1, outputToken) => {
    this.setState({
      inputToken: token,
      inputValue: convertUtil.toOriginalAmount(value, token.pDecimals),
      outputToken: outputToken,
      outputValue: null,
      inputError: null,
      balance: 'Loading',
    }, () => {
      this.filterOutputList(() => {
        const { inputValue } = this.state;
        this.changeInputValue(convertUtil.toHumanAmount(inputValue, token.pDecimals));
        this.getInputBalance();
      });
    });
  };

  selectOutput = (token) => {
    this.setState({ outputToken: token }, this.calculateOutputValue);
  };

  changeInputValue = (newValue) => {
    const { balance, inputToken } = this.state;
    let number = convertUtil.toNumber(newValue);

    if (!newValue || newValue.length === 0) {
      this.setState({ inputError: null, inputValue: 0 }, this.calculateOutputValue);
    } else if (_.isNaN(number)) {
      this.setState({inputError: MESSAGES.MUST_BE_NUMBER });
    } else {
      number = convertUtil.toOriginalAmount(number, inputToken.pDecimals, inputToken.pDecimals !== 0);
      if (number < MIN_INPUT) {
        this.setState({
          inputError: MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, inputToken.pDecimals),
          inputValue: 0,
        }, this.calculateOutputValue);
      } else if (!Number.isInteger(number)) {
        this.setState({
          inputError: MESSAGES.MUST_BE_INTEGER,
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

    this.setState({ rawText: newValue ? newValue.toString() : '' });
  };

  async filterOutputList(callback) {
    try {
      const { inputToken: token } = this.state;
      const { pairTokens, pairs } = this.props;

      let { outputToken } = this.state;
      const outputPairs = pairs.filter(pair => pair[token.id]);
      const outputList = _(outputPairs)
        .map(pair => {
          const id = pair.keys.find(key => key !== token.id);
          const pool = pair[id];
          return ({ id, pool });
        })
        .map(({ id, pool }) => ({
          ...pairTokens.find(token => token.id === id),
          pool: convertUtil.toRealTokenValue(pairTokens, id, pool),
        }))
        .filter(item => item)
        .orderBy([
          item => PRIORITY_LIST.indexOf(item?.id) > -1 ? PRIORITY_LIST.indexOf(item?.id) : 100,
          'hasIcon',
          'pool',
          item => item.symbol && item.symbol.toLowerCase(),
        ], ['asc', 'desc', 'desc', 'asc'])
        .value();

      if (outputToken && !outputList.find(item => item.id === outputToken.id)) {
        outputToken = null;
      }

      this.setState({
        outputPairs,
        outputList,
        outputToken: outputToken || outputList[0],
      }, () => {
        callback && callback();
        this.calculateOutputValue();
      });
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  }

  calculateInputValue(outputToken, outputValue, inputToken) {
    try {
      const { pairs } = this.props;
      const pair = pairs.find(i => {
        const keys = Object.keys(i);
        return keys.includes(outputToken.id) && keys.includes(inputToken.id);
      });
      const inputPool = pair[inputToken.id];
      const outputPool = pair[outputToken.id];
      const initialPool = inputPool * outputPool;
      const newOutputPool = outputPool - outputValue;
      const newInputPool = _.ceil(initialPool / newOutputPool);
      return newInputPool - inputPool;
    } catch (error) {
      console.debug('CALCULATE INPUT', error);
    }
  }

  calculateOutputValue() {
    try {
      const {outputPairs, outputToken, inputToken, inputValue} = this.state;

      if (!outputToken || !_.isNumber(inputValue) || _.isNaN(inputValue) || inputValue === 0) {
        return this.setState({ outputValue: 0 });
      }

      const pair = outputPairs.find(i => Object.keys(i).includes(outputToken.id));
      const inputPool = pair[inputToken.id];
      const outputPool = pair[outputToken.id];
      const initialPool = inputPool * outputPool;
      const newInputPool = inputPool + inputValue - 0;
      const newOutputPoolWithFee = _.ceil(initialPool / newInputPool);
      const outputValue = outputPool - newOutputPoolWithFee;
      this.setState({ outputValue, pair });
    } catch (error) {
      console.debug('CALCULATE OUTPUT', error);
    }
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
    if (inputToken?.id === PRV.id) {
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

  swapTokens = () => {
    const { inputToken, inputValue, outputToken } = this.state;

    if (!inputToken || !outputToken) {
      return;
    }

    this.selectInput(outputToken, convertUtil.toHumanAmount(inputValue, inputToken.pDecimals), inputToken);
  };

  trade = async (networkFee, networkFeeUnit, tradingFee, stopPrice) => {
    const { wallet, dexMainAccount } = this.props;
    const { sending, balance, inputToken, inputValue, outputToken } = this.state;
    let prvBalance;
    let prvFee = 0;
    let tokenFee = 0;
    if (sending) {
      return;
    }

    this.setState({ sending: true, tradeError: null });
    let result;

    try {
      if (inputToken?.id === PRV.id) {
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

      await logEvent(CONSTANT_EVENTS.TRADE, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
      });
      result = await this.tradePToken(dexMainAccount, tradingFee, networkFee, networkFeeUnit, stopPrice);
      if (result && result.txId) {
        const { onAddHistory } = this.props;
        const { outputValue, outputToken } = this.state;
        this.setState({ showSwapSuccess: true, showTradeConfirm: false });

        await logEvent(CONSTANT_EVENTS.TRADE_SUCCESS, {
          inputTokenId: inputToken.id,
          inputTokenSymbol: inputToken.symbol,
          outputTokenId: outputToken.id,
          outputTokenSymbol: outputToken.symbol,
        });

        onAddHistory(new TradeHistory(result, inputToken, outputToken, inputValue, outputValue, networkFee, networkFeeUnit, tradingFee, stopPrice));
      }
    } catch (error) {
      await logEvent(CONSTANT_EVENTS.TRADE_FAILED, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
      });

      this.setState({ tradeError: new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR) });
    } finally {
      this.setState({ sending: false });
    }
  };

  swap = async () => {
    const { inputError } = this.state;

    if (inputError === MESSAGES.BALANCE_INSUFFICIENT && !this.seenDepositGuide) {
      return this.updateSeenDepositGuide();
    }
    this.setState({ showTradeConfirm: true });
  };

  closeSuccessDialog = () => {
    const { inputToken } = this.state;
    this.setState({
      showSwapSuccess: false,
      inputValue: convertUtil.toOriginalAmount(1, inputToken.pDecimals),
      rawText: '1',
      outputValue: null,
    }, () => {
      this.calculateOutputValue();
    });
  };

  renderFee() {
    const {
      inputToken,
      inputValue,
      outputToken,
      outputValue,
      pair,
    } = this.state;

    return (
      <View style={mainStyle.feeWrapper}>
        <ExchangeRate
          inputToken={inputToken}
          inputValue={inputValue}
          outputToken={outputToken}
          outputValue={outputValue}
        />
        <PoolSize
          inputToken={inputToken}
          pair={pair}
          outputToken={outputToken}
        />
      </View>
    );
  }

  renderInputs() {
    const { wallet, dexMainAccount, pairTokens, isLoading } = this.props;
    const {
      inputToken,
      outputToken,
      outputValue,
      outputList,
      balance,
      inputError,
      rawText,
      pair,
    } = this.state;

    return (
      <View>
        <Input
          tokenList={pairTokens}
          onSelectToken={this.selectInput}
          onChange={this.changeInputValue}
          headerTitle="From"
          balance={balance}
          token={inputToken}
          value={rawText}
          account={dexMainAccount}
          wallet={wallet}
          pool={!!pair && !!inputToken && pair[inputToken.id]}
          disabled={isLoading}
          onlyPToken
        />
        {!!inputError && (inputError !== MESSAGES.BALANCE_INSUFFICIENT || this.seenDepositGuide) && (
          <Text style={mainStyle.error}>
            {inputError}
          </Text>
        )}
        <View style={mainStyle.arrowWrapper}>
          <Divider style={mainStyle.divider} />
          <TouchableOpacity onPress={this.swapTokens}>
            <Image source={downArrow} style={mainStyle.arrow} />
          </TouchableOpacity>
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
          pool={!!pair && !!outputToken && pair[outputToken.id]}
          onlyPToken
        />
      </View>
    );
  }

  render() {
    const { isLoading } = this.props;
    const {
      outputValue,
      sending,
      inputToken,
      inputValue,
      outputToken,
      showSwapSuccess,
      showTradeConfirm,
      tradeError,
      balance,
      prvBalance,
    } = this.state;
    const {
      wallet,
      dexMainAccount,
    } = this.props;
    let { inputError } = this.state;

    if (inputError === MESSAGES.BALANCE_INSUFFICIENT && !this.seenDepositGuide) {
      inputError = null;
    }

    return (
      <View style={mainStyle.componentWrapper}>
        <View>
          <View style={mainStyle.content}>
            {this.renderInputs()}
            <View style={mainStyle.dottedDivider} />
            {this.renderFee()}
            <View style={[mainStyle.actionsWrapper]}>
              <Button
                title="Trade"
                style={[mainStyle.button]}
                disabled={
                  sending ||
                  inputError ||
                  !outputValue ||
                  outputValue <= 0 ||
                  isLoading
                }
                disabledStyle={mainStyle.disabledButton}
                onPress={this.swap}
              />
            </View>
          </View>
        </View>
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
        {/*<WithdrawalInProgress />*/}
      </View>
    );
  }
}

Swap.propTypes = {
  wallet: PropTypes.object.isRequired,
  onShowDepositGuide: PropTypes.func.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onUpdateTradeParams: PropTypes.func.isRequired,
  dexMainAccount: PropTypes.object.isRequired,
  pairs: PropTypes.array.isRequired,
  pairTokens: PropTypes.array.isRequired,
  tradeParams: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default Swap;
