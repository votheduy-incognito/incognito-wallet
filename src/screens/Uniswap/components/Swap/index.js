import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {ActivityIndicator, Button, Image, Text, TouchableOpacity, View,} from '@src/components/core';
import downArrow from '@src/assets/images/icons/down_arrow.png';
import accountService from '@services/wallet/accountService';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import {Divider} from 'react-native-elements';
import ExchangeRate from '@screens/Uniswap/components/ExchangeRate';
import {ExHandler} from '@services/exception';
import {MESSAGES, MIN_INPUT,KYBER_TRADE_ABI, KYBER_TRADE_ADDRESS, OX_TRADE_ABI, OX_TRADE_ADDRESS} from '@screens/Uniswap/constants';
import {execute, execute0x, getQuote} from '@services/trading';
import {generateQuoteURL, get0xQuote} from '@services/trading/0x';
import {TradeHistory} from '@models/uniswapHistory';
import TradingToken from '@models/tradingToken';
import {logEvent} from '@services/firebase';
import {CONSTANT_EVENTS} from '@src/constants';
import TradeConfirm from '../TradeConfirm';
import SwapSuccessDialog from '../SwapSuccessDialog';
import Input from '../Input';
import {mainStyle} from '../../style';

class Swap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.tradeParams,
      showTradeConfirm: false,
    };

    this.getPairQuoteData = _.debounce(this.getPairQuoteData.bind(this), 500);
  }

  componentDidUpdate(prevProps, prevState) {
    const { tokens, onUpdateTradeParams } = this.props;

    if (tokens.length > 0 && tokens !== prevProps.tokens) {
      this.loadData();
    }

    if (this.state !== prevState) {
      onUpdateTradeParams(prevState);
    }
  }

  loadData = () => {
    const { tokens } = this.props;
    const { inputToken } = this.state;

    if (!tokens || tokens.length <= 0) {
      return;
    }

    if (inputToken) {
      if (tokens.find(item => item.id === inputToken.id)) {
        this.filterOutputList();
        this.getInputBalance();
      } else {
        this.selectInput(tokens[0]);
      }
    } else {
      this.selectInput(tokens[0]);
    }
  };

  async getInputBalance(balance) {
    const { inputToken: token, balance: prevBalance } = this.state;
    try {
      if (!_.isNumber(balance)) {
        balance = await this.getBalance(token);
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

      this.setState({ balance });
    } catch (error) {
      console.debug('GET INPUT BALANCE ERROR', error);
    }
  }

  selectInput = (inputToken, value = 1, outputToken) => {
    this.setState({
      inputToken: inputToken,
      inputValue: convertUtil.toOriginalAmount(value, inputToken.pDecimals),
      outputToken: null,
      outputValue: null,
      inputError: null,
      balance: 'Loading',
    }, () => {
      this.filterOutputList(() => {
        const {inputValue, outputList} = this.state;

        const token = outputToken && outputList.find(token => token.id === outputToken.id);

        if (token) {
          this.selectOutput(token);
        }

        this.changeInputValue(convertUtil.toHumanAmount(inputValue, inputToken.pDecimals));
        this.getInputBalance();
      });
    });
  };

  selectOutput = (token) => {
    this.setState({ outputToken: token }, this.getPairQuote);
  };

  changeInputValue = (newValue) => {
    const { balance, inputToken } = this.state;
    let number = convertUtil.toNumber(newValue);

    if (!newValue || newValue.length === 0) {
      this.setState({ inputError: null, inputValue: 0 }, this.getPairQuote);
    } else if (_.isNaN(number)) {
      this.setState({inputError: MESSAGES.MUST_BE_NUMBER });
    } else {
      number = convertUtil.toOriginalAmount(number, inputToken.pDecimals, inputToken.pDecimals !== 0);
      if (number < MIN_INPUT) {
        this.setState({
          inputError: MESSAGES.GREATER_OR_EQUAL(MIN_INPUT, inputToken.pDecimals),
          inputValue: 0,
        }, this.getPairQuote);
      } else if (!Number.isInteger(number)) {
        this.setState({
          inputError: MESSAGES.MUST_BE_INTEGER,
          inputValue: 0,
        }, this.getPairQuote);
      } else if (number > balance) {
        this.setState({
          inputError: MESSAGES.BALANCE_INSUFFICIENT,
          inputValue: number,
        }, this.getPairQuote);
      } else {
        this.setState({ inputError: null });
        this.setState({ inputValue: number }, this.getPairQuote);
      }
    }

    this.setState({ rawText: newValue ? formatUtil.toFixed(newValue, inputToken?.pDecimals) : '' });
  };

  async filterOutputList(callback) {
    try {
      const { inputToken } = this.state;
      const { tokens } = this.props;

      let { outputToken } = this.state;
      const filteredTokens = tokens
        .filter(token => token.id !== inputToken.id)
        .filter(token => {
          const sameProtocol = _.intersection(token.protocol, inputToken.protocol);
          return sameProtocol.length > 0;
        });

      const outputTokens = [];
      filteredTokens.forEach(token => {
        token.protocol.forEach(protocol => {
          if (inputToken.protocol.includes(protocol)) {
            outputTokens.push(new TradingToken({
              ...token,
              protocol,
            }));
          }
        });
      });

      const outputList = outputTokens;

      this.setState({
        outputList,
        outputToken: outputToken || outputList[0],
      }, () => {
        callback && callback();
        this.getPairQuote();
      });
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  }

  async getPairQuote() {
    this.setState({ loadingOutput: true });

    const {inputError} = this.state;

    if (inputError === 'Asset liquidity is insufficient.') {
      this.setState({ inputError: '' });
    }

    this.getPairQuoteData();
  }

  async getPairQuoteData() {
    try {
      const {outputToken, inputToken, inputValue, inputError} = this.state;

      if (inputError && inputError !== 'Asset liquidity is insufficient.') {
        this.setState({outputValue: 0, price: 0});
        return;
      }

      const quote = await getQuote({
        sellToken: inputToken,
        sellAmount: inputValue,
        buyToken: outputToken,
        protocol: outputToken?.protocol,
      });

      const {inputValue: currentInputValue} = this.state;

      if (inputValue === currentInputValue) {
        const {inputError: currentInputError} = this.state;

        if (currentInputError === 'Asset liquidity is insufficient.') {
          this.setState({inputError: ''});
        }

        const {amount: outputValue, price} = quote;
        this.setState({outputValue, price});
      }
    } catch (error) {
      this.setState({
        inputError: 'Asset liquidity is insufficient.',
        outputValue: 0,
        price: 0,
      });
    } finally {
      this.setState({ loadingOutput: false });
    }
  }

  trade0x = async (stopPricePercent = 0.01) => {
    const {dexMainAccount, wallet} = this.props;
    const {inputToken, inputValue, outputToken} = this.state;

    const originalValue = convertUtil.toDecimals(inputValue, inputToken).toString();
    const {to: quoteTo, data: quoteData} = await get0xQuote({
      sellToken: inputToken,
      sellAmount: originalValue,
      buyToken: outputToken,
      protocol: outputToken?.protocol,
      slippagePercentage: (stopPricePercent / 100),
    });

    const data = {
      sourceToken: inputToken.address,
      sourceQuantity: originalValue,
      destToken: outputToken.address,
      tradeABI: OX_TRADE_ABI,
      tradeDeployedAddress: OX_TRADE_ADDRESS,
      privateKey: dexMainAccount.PrivateKey,
      quoteTo,
      quoteData,
    };

    const res = await accountService.sign0x(wallet, data);
    const {signBytes, input, timestamp} = res;

    return execute0x({
      timestamp,
      icAddress: dexMainAccount.PaymentAddress,
      signBytes,
      sourceTokenAmount: data.sourceQuantity,
      sourceTokenAddress: data.sourceToken,
      destTokenAddress: data.destToken,
      tokenId: inputToken.id,
      dAppAddress: data.tradeDeployedAddress,
      input,
    });
  };

  tradeKyber = async (stopPrice) => {
    const {dexMainAccount, wallet} = this.props;
    const {inputToken, inputValue, outputToken} = this.state;

    const originalValue = convertUtil.toDecimals(inputValue, inputToken).toString();

    const data = {
      sourceToken: inputToken.address,
      sourceQuantity: originalValue,
      destToken: outputToken.address,
      quoteUrl: generateQuoteURL({
        buyToken: outputToken.symbol,
        sellToken: inputToken.symbol,
        sellAmount: inputValue,
      }),
      tradeABI: KYBER_TRADE_ABI,
      tradeDeployedAddress: KYBER_TRADE_ADDRESS,
      privateKey: dexMainAccount.PrivateKey,
      expectRate: convertUtil.toDecimals(stopPrice, outputToken).toString(),
    };

    const res = await accountService.signKyber(wallet, data);
    const {signBytes, input, timestamp} = res;

    return execute({
      timestamp,
      icAddress: dexMainAccount.PaymentAddress,
      signBytes,
      sourceTokenAmount: data.sourceQuantity,
      sourceTokenAddress: data.sourceToken,
      destTokenAddress: data.destToken,
      tokenId: inputToken.id,
      dAppAddress: data.tradeDeployedAddress,
      input,
    });
  };

  async tradePToken(stopPrice, stopPricePercent) {
    const {outputToken} = this.state;

    if (outputToken.is0x()) {
      return this.trade0x(stopPricePercent);
    }

    return this.tradeKyber(stopPrice);
  }

  swapTokens = () => {
    const {inputToken, inputValue, outputToken} = this.state;
    const {tokens} = this.props;

    if (!inputToken || !outputToken) {
      return;
    }

    const rawInput = tokens.find(token => token.id === outputToken.id);

    this.setState({outputValue: 0, price: 0});

    this.selectInput(rawInput, convertUtil.toHumanAmount(inputValue, inputToken.pDecimals), inputToken);
  };

  getBalance = (token) => {
    const {onGetBalance} = this.props;
    return onGetBalance(token);
  };

  showTradeConfirm = () => {
    const {
      sending,
      balance,
      inputToken,
      inputValue,
    } = this.state;
    if (sending) {
      return;
    }

    if (balance < inputValue) {
      return this.setState({ inputError: MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol) });
    }

    this.setState({ showTradeConfirm: true });
  };

  trade = async (stopPrice, stopPricePercent) => {
    const {
      sending,
      balance,
      inputToken,
      inputValue,
      outputToken,
      outputValue,
    } = this.state;
    const {
      onAddHistory,
    } = this.props;
    if (sending) {
      return;
    }

    this.setState({ sending: true, tradeError: null });
    let result;

    try {
      if (balance < inputValue) {
        return this.setState({ tradeError: MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol) });
      }

      logEvent(CONSTANT_EVENTS.TRADE_UNISWAP, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
        protocol: outputToken.protocol,
      });
      result = await this.tradePToken(stopPrice, stopPricePercent);
      await logEvent(CONSTANT_EVENTS.TRADE_SUCCESS, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
        protocol: outputToken.protocol,
      });

      const history = new TradeHistory({
        id: result,
        result,
        inputToken,
        outputToken,
        inputValue,
        outputValue,
        stopPrice,
      });
      history.status = 'pending';
      onAddHistory(history);
      this.setState({ showSwapSuccess: true, showTradeConfirm: false, });
    } catch (error) {
      logEvent(CONSTANT_EVENTS.TRADE_UNISWAP_FAILED, {
        inputTokenId: inputToken.id,
        inputTokenSymbol: inputToken.symbol,
        outputTokenId: outputToken.id,
        outputTokenSymbol: outputToken.symbol,
        protocol: outputToken.protocol,
      });

      this.setState({ tradeError: new ExHandler(error).getMessage(MESSAGES.TRADE_ERROR) });
    } finally {
      this.setState({ sending: false });
    }
  };

  closeSuccessDialog = () => {
    const { inputToken } = this.state;
    this.setState({
      showSwapSuccess: false,
      inputError: convertUtil.toOriginalAmount(1, inputToken.pDecimals),
      rawText: '1',
      outputValue: null,
    }, () => {
      this.changeInputValue('1');
      this.getPairQuote();
    });
  };

  renderFee() {
    const {
      inputToken,
      outputToken,
      price,
    } = this.state;

    return (
      <View style={mainStyle.feeWrapper}>
        <ExchangeRate
          inputToken={inputToken}
          outputToken={outputToken}
          price={price}
        />
      </View>
    );
  }

  renderInputs() {
    const { wallet, dexMainAccount, tokens, isLoading } = this.props;
    const {
      inputToken,
      outputToken,
      outputValue,
      outputList,
      balance,
      inputError,
      rawText,
      loadingOutput,
      tradeError,
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
          value={rawText}
          account={dexMainAccount}
          wallet={wallet}
          disabled={isLoading}
        />
        {(!!inputError || (!!tradeError)) && (
          <Text style={mainStyle.error}>
            {inputError || tradeError}
          </Text>
        )}
        <View style={mainStyle.arrowWrapper}>
          <Divider style={mainStyle.divider} />
          <TouchableOpacity onPress={this.swapTokens}>
            <Image source={downArrow} style={mainStyle.arrow} />
          </TouchableOpacity>
          <Divider style={mainStyle.divider} />
        </View>
        <View>
          <Input
            tokenList={outputList}
            onSelectToken={this.selectOutput}
            headerTitle="To (estimated)"
            token={outputToken}
            account={dexMainAccount}
            wallet={wallet}
            value={outputValue ? formatUtil.amountFull(outputValue, outputToken?.pDecimals) : '0'}
          />
          { !!loadingOutput && (
            <ActivityIndicator
              size="small"
              style={{
                position: 'absolute',
                right: 120,
                bottom: 12,
              }}
            />
          ) }
        </View>
      </View>
    );
  }

  render() {
    const {
      outputValue,
      sending,
      inputToken,
      inputValue,
      outputToken,
      showSwapSuccess,
      inputError,
      loadingOutput,
      showTradeConfirm,
    } = this.state;
    const {
      isLoading,
    } = this.props;

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
                  isLoading ||
                  loadingOutput
                }
                disabledStyle={mainStyle.disabledButton}
                onPress={this.showTradeConfirm}
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
          inputToken={inputToken}
          inputValue={inputValue}
          outputToken={outputToken}
          outputValue={outputValue}
          onClose={() => this.setState({ showTradeConfirm: false, tradeError: null })}
          onTrade={this.trade}
          visible={showTradeConfirm}
          sending={sending}
        />
      </View>
    );
  }
}

Swap.propTypes = {
  wallet: PropTypes.object.isRequired,
  onUpdateTradeParams: PropTypes.func.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  dexMainAccount: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  tradeParams: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default Swap;
