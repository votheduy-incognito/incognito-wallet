import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Image,
  Text,
  View,
  TouchableOpacity,
} from '@src/components/core';
import { TextInput } from 'react-native';
import chevronRight from '@src/assets/images/icons/chevron_right.png';
import { isExchangeRatePToken } from '@src/services/wallet/RpcClientService';
import {PRV} from '@services/wallet/tokenService';
import {CONSTANT_COMMONS} from '@src/constants';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import greyRightArrow from '@src/assets/images/icons/grey_right_arrow.png';
import {Overlay, Icon} from 'react-native-elements';
import Help from '@components/Help';
import FullScreenLoading from '@components/FullScreenLoading/index';
import {MESSAGES, MIN_VALUE, PRV_ID} from '../../constants';
import style from './style';
import { mainStyle } from '../../style';

function parseFee(rawFee, token) {
  rawFee = convertUtil.toNumber(rawFee, true);
  rawFee = rawFee > 0 ? rawFee : 0;
  rawFee = convertUtil.toOriginalAmount(rawFee, token?.pDecimals);

  return _.floor(rawFee, 0);
}

function isNumber(text) {
  return _.isNumber(text);
}

function formatFee(fee, pDecimals) {
  const feeString = isNumber(fee) ? formatUtil.amountFull(fee, pDecimals) : fee;
  const feeInput = feeString || '';
  const feeNumber = _.isString(fee) ? convertUtil.toNumber(fee, true) : 0;
  const originalFee = feeNumber > 0 ? convertUtil.toOriginalAmount(feeNumber, pDecimals) : 0;
  const displayFee = originalFee > 0 ? formatUtil.amountFull(originalFee, pDecimals) : feeString;

  return {
    displayFee,
    feeInput,
  };
}

class TradeConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      networkFee: null,
      networkFeeUnit: 'PRV',
      tradingFee: null,
      stopPrice: null,
      supportedFeeTypes: ['PRV'],
      expandNetworkFee: false,
      expandTradingFee: false,
      expandStopPrice: false,
    };
  }

  componentDidMount() {
    const { visible } = this.props;
    if (visible) {
      this.updateData();
    }
  }

  componentDidUpdate(prevProps) {
    const { inputToken, visible } = this.props;
    if (inputToken !== prevProps.inputToken && inputToken && inputToken.id) {
      this.getSupportedFeeTypes(inputToken);
    }

    if (visible !== prevProps.visible && visible) {
      this.updateData();
      this.getSupportedFeeTypes(inputToken);
    }
  }

  updateData() {
    const { inputToken, inputValue, outputValue, outputToken } = this.props;
    const { supportedFeeTypes } = this.state;
    const networkFeeUnit = _.first(supportedFeeTypes) || PRV.symbol;
    const tradingFee = inputValue / 400;
    const tradingPercent = 0.25;
    const stopPrice = outputValue - outputValue / 100;
    const stopPricePercent = 1;
    const pDecimals = networkFeeUnit === inputToken.symbol ? inputToken.pDecimals : PRV.pDecimals || 0;
    const networkFee = MIN_VALUE;
    this.setState({
      networkFee: formatUtil.amountFull(networkFee, pDecimals),
      networkFeeUnit,
      tradingFee: formatUtil.amountFull(tradingFee, inputToken?.pDecimals),
      tradingPercent: formatUtil.toFixed(tradingPercent, 2),
      stopPrice: formatUtil.amountFull(stopPrice, outputToken?.pDecimals),
      stopPricePercent: formatUtil.toFixed(stopPricePercent, 2),
      pDecimals,
      expandNetworkFee: false,
      expandTradingFee: false,
      expandStopPrice: false,
      tradingFeeError: null,
      stopPriceError: null,
      networkFeeError: null,
    });
  }

  getSupportedFeeTypes = async (token) => {
    const supportedFeeTypes = [];
    try {
      const isUsed = await isExchangeRatePToken(token.id);
      isUsed && supportedFeeTypes.push(token.symbol);
    } finally {
      this.setState({
        supportedFeeTypes: [...supportedFeeTypes, CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV]
      });
    }
  };

  handleSelectFee = (type) => {
    const { inputToken } = this.props;
    const { networkFee, pDecimals: previousPDecimals } = this.state;
    const networkFeeNumber = convertUtil.toNumber(networkFee.replace ? networkFee : 0, true);
    const pDecimals = type === inputToken.symbol ? inputToken.pDecimals : PRV.pDecimals || 0;

    if (networkFee && !_.isNaN(networkFeeNumber)) {
      const originalNetworkFee = convertUtil.toOriginalAmount(networkFeeNumber, previousPDecimals);
      const newNetworkFee = formatUtil.amountFull(originalNetworkFee, pDecimals);
      this.setState({ networkFee: newNetworkFee, pDecimals });
    }

    this.setState({
      networkFeeUnit: type,
      pDecimals,
    });
  };

  changeFee = (text) => {
    const networkFee = convertUtil.toNumber(text, true);

    if (networkFee >= 0) {
      const { pDecimals } = this.state;
      const originalAmount = convertUtil.toOriginalAmount(networkFee, pDecimals);

      if (originalAmount < MIN_VALUE) {
        this.setState({ networkFeeError: MESSAGES.GREATER_OR_EQUAL(MIN_VALUE, pDecimals) });
      } else {
        this.setState({networkFeeError: null});
      }
    } else {
      this.setState({ networkFeeError: MESSAGES.NEGATIVE_NUMBER });
    }

    this.setState({ networkFee: text });
  };

  changeTradingFee = (text) => {
    const tradingFee = convertUtil.toNumber(text, true);
    if (!_.isNaN(tradingFee) && tradingFee >= 0) {
      const { inputValue, inputToken } = this.props;
      const originalTradingFee = convertUtil.toOriginalAmount(tradingFee, inputToken.pDecimals || 0);
      const tradingPercent = _.floor(originalTradingFee / inputValue * 100, 2);
      this.setState({ tradingFee: originalTradingFee, tradingPercent, tradingFeeError: null, tradingFeeErrorField: null });
    } else {
      this.setState({ tradingFeeError: MESSAGES.NOT_NEGATIVE_NUMBER, tradingFeeErrorField: 1, tradingFee: text });
    }

    this.setState({ tradingFee: text });
  };

  changeTradingFeePercent = (text) => {
    const tradingPercent = convertUtil.toNumber(text, true);
    if (!_.isNaN(tradingPercent) && tradingPercent >= 0) {
      const {inputValue, inputToken} = this.props;
      const tradingFee = formatUtil.amountFull(inputValue * (tradingPercent / 100), inputToken.pDecimals);
      this.setState({ tradingFee, tradingFeeError: null, tradingFeeErrorField: null });
    } else {
      this.setState({ tradingFeeError: MESSAGES.NOT_NEGATIVE_NUMBER, tradingFeeErrorField: 0, });
    }

    this.setState({ tradingPercent: text });
  };

  changeStopPrice = (text) => {
    const stopPrice = convertUtil.toNumber(text, true);
    const { outputValue, outputToken } = this.props;

    if (!_.isNaN(stopPrice) && stopPrice > 0) {
      const originalStopPrice = convertUtil.toOriginalAmount(stopPrice, outputToken.pDecimals || 0);
      const stopPricePercent = _.floor((outputValue - originalStopPrice) / outputValue * 100, 2);
      this.setState({ stopPricePercent, stopPriceError: null, stopPriceErrorField: null });
    } else {
      this.setState({ stopPriceError: MESSAGES.NEGATIVE_NUMBER });
      this.setState({ stopPriceErrorField: 0 });
    }

    this.setState({ stopPrice: text });
  };

  changeStopPricePercent = (text) => {
    const { outputValue, outputToken } = this.props;
    const stopPricePercent = convertUtil.toNumber(text, true);
    if (!_.isNaN(stopPricePercent) && stopPricePercent < 100) {
      const stopPrice = formatUtil.amountFull(outputValue * ((100 - stopPricePercent) / 100), outputToken.pDecimals);
      this.setState({ stopPrice, stopPriceError: null, stopPriceErrorField: null, });
    } else {
      if (stopPricePercent >= 100) {
        this.setState({stopPriceError: MESSAGES.SMALLER_THAN_100 });
      } else {
        this.setState({stopPriceError: MESSAGES.NEGATIVE_NUMBER});
      }
      this.setState({stopPriceErrorField: 1});
    }

    this.setState({ stopPricePercent: text });
  };

  toggleNetworkFee = () => {
    const { expandNetworkFee } = this.state;
    this.setState({
      expandNetworkFee: !expandNetworkFee,
      expandTradingFee: false,
      expandStopPrice: false,
    });
  };

  toggleTradingFee = () => {
    const { expandTradingFee } = this.state;
    this.setState({
      expandTradingFee: !expandTradingFee,
      expandNetworkFee: false,
      expandStopPrice: false,
    });
  };

  toggleStopPrice = () => {
    const { expandStopPrice } = this.state;
    this.setState({
      expandStopPrice: !expandStopPrice,
      expandNetworkFee: false,
      expandTradingFee: false,
    });
  };

  trade = () => {
    const { onTrade, inputToken, outputToken } = this.props;
    const { networkFee, networkFeeUnit, tradingFee, stopPrice } = this.state;

    console.debug('TRADE FEE',
      parseFee(networkFee, networkFeeUnit === PRV.symbol ? PRV : inputToken),
      networkFeeUnit,
      parseFee(tradingFee, inputToken),
      parseFee(stopPrice, outputToken),
    );

    onTrade(
      parseFee(networkFee, networkFeeUnit === PRV.symbol ? PRV : inputToken),
      networkFeeUnit,
      parseFee(tradingFee, inputToken),
      parseFee(stopPrice, outputToken),
    );
  };

  renderNetworkFee() {
    const {
      networkFee,
      networkFeeUnit,
      expandNetworkFee,
      supportedFeeTypes,
      networkFeeError,
      pDecimals,
    } = this.state;
    const { displayFee, feeInput } = formatFee(networkFee, pDecimals);

    return (
      <View style={style.feeWrapper}>
        <TouchableOpacity style={mainStyle.twoColumns} onPress={this.toggleNetworkFee}>
          <View style={mainStyle.twoColumns}>
            <Text style={[style.fee, style.feeTitle]}>Network Fee</Text>
            <Help
              title="Network Fee"
              content="Transactions on the Incognito Blockchain incur a small fee."
              marginLeft={-2}
            />
          </View>
          <View style={[mainStyle.twoColumns, mainStyle.textRight]}>
            {!expandNetworkFee && (
              <View style={mainStyle.twoColumns}>
                <Text numberOfLines={1} style={style.fee}>{displayFee || 0}</Text>
                <Text style={style.fee}>
                  &nbsp;{networkFeeUnit}
                </Text>
              </View>
            )}
            <View>
              <Image source={chevronRight} style={[style.expandIcon, expandNetworkFee && style.expandIconActive]} />
            </View>
          </View>
        </TouchableOpacity>
        {expandNetworkFee && (
          <View style={style.expandContent}>
            <Text style={style.desc}>Pay network fee in {supportedFeeTypes.length === 1 && networkFeeUnit}</Text>
            <View style={mainStyle.twoColumns}>
              {supportedFeeTypes.length > 1 && supportedFeeTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[style.feeType, networkFeeUnit === type && style.feeActive]}
                  onPress={this.handleSelectFee.bind(this, type)}
                >
                  <Text style={[style.feeTypeText, networkFeeUnit === type && style.feeActiveText]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <TextInput
                value={feeInput}
                onChangeText={this.changeFee}
                keyboardType="decimal-pad"
                style={[style.input, { flex: 0 }, networkFeeError && style.errorHighlight]}
              />
              <Text style={style.feeUnit}>{networkFeeUnit}</Text>
            </View>
            {!!networkFeeError && <Text style={[mainStyle.error, style.error]}>{networkFeeError}</Text>}
          </View>
        )}
      </View>
    );
  }

  renderTradingFee() {
    const { inputToken } = this.props;
    const {
      tradingFee,
      tradingPercent,
      expandTradingFee,
      tradingFeeError,
      tradingFeeErrorField,
    } = this.state;
    const { feeInput, displayFee } = formatFee(tradingFee, inputToken?.pDecimals);
    return (
      <View style={style.feeWrapper}>
        <TouchableOpacity onPress={this.toggleTradingFee} style={mainStyle.twoColumns}>
          <View style={mainStyle.twoColumns}>
            <Text style={[style.feeTitle]}>Trading Fee</Text>
            <Help title="Trading Fee" content="You’re paying this fee to initiate the trade." marginLeft={-2} />
          </View>
          <View style={[mainStyle.twoColumns, mainStyle.textRight]}>
            {!expandTradingFee && (
              <View style={mainStyle.twoColumns}>
                <Text numberOfLines={1} style={style.fee}>
                  {displayFee || 0}
                </Text>
                <Text style={style.fee}>
                  &nbsp;{inputToken.symbol}
                </Text>
              </View>
            )}
            <View>
              <Image source={chevronRight} style={[style.expandIcon, expandTradingFee && style.expandIconActive]} />
            </View>
          </View>
        </TouchableOpacity>
        {expandTradingFee && (
          <View style={style.expandContent}>
            <Text style={style.desc}>Set your own trading fee. Here you can choose to pay a higher fee to prioritize your order.</Text>
            <View style={mainStyle.twoColumns}>
              <View style={style.percentWrapper}>
                <TextInput
                  value={tradingPercent && tradingPercent.toString()}
                  onChangeText={this.changeTradingFeePercent}
                  style={[style.input, style.percentInput, tradingFeeErrorField === 0 && style.errorHighlight]}
                  keyboardType="decimal-pad"
                />
                <Text style={style.percent}>%</Text>
              </View>
              <Icon name="compare-arrows" containerStyle={style.compare} />
              <TextInput
                value={feeInput}
                onChangeText={this.changeTradingFee}
                style={[style.input, tradingFeeErrorField === 1 && style.errorHighlight, style.fullInput]}
                keyboardType="decimal-pad"
              />
            </View>
            {!!tradingFeeError && <Text style={[mainStyle.error, style.error]}>{tradingFeeError}</Text>}
          </View>
        )}
      </View>
    );
  }

  renderStopPrice() {
    const { outputToken } = this.props;
    const {
      stopPrice,
      stopPricePercent,
      expandStopPrice,
      stopPriceError,
      stopPriceErrorField,
    } = this.state;
    const { feeInput, displayFee } = formatFee(stopPrice, outputToken?.pDecimals);

    return (
      <View style={style.feeWrapper}>
        <TouchableOpacity onPress={this.toggleStopPrice} style={mainStyle.twoColumns}>
          <View style={mainStyle.twoColumns}>
            <Text style={[style.fee, style.feeTitle]}>Minimum Amount</Text>
            <Help
              title="Minimum Account"
              content="Taking into account movements in price, this is the minimum amount you will accept."
              marginLeft={-40}
            />
          </View>
          <View style={[mainStyle.twoColumns, mainStyle.textRight]}>
            {!expandStopPrice && (
              <View style={mainStyle.twoColumns}>
                <Text numberOfLines={1} style={style.fee}>
                  {displayFee || 0}
                </Text>
                <Text style={style.fee}>
                  &nbsp;{outputToken.symbol}
                </Text>
              </View>
            )}
            <View>
              <Image source={chevronRight} style={[style.expandIcon, expandStopPrice && style.expandIconActive]} />
            </View>
          </View>
        </TouchableOpacity>
        {expandStopPrice && (
          <View style={style.expandContent}>
            <Text style={style.desc}>
              You can increase the minimum amount you will accept. However, this runs the risk of the order failing due to movements in price.
            </Text>
            <View style={mainStyle.twoColumns}>
              <View style={style.percentWrapper}>
                <TextInput
                  value={stopPricePercent && stopPricePercent.toString()}
                  onChangeText={this.changeStopPricePercent}
                  style={[style.input, style.percentInput, stopPriceErrorField === 1 && style.errorHighlight]}
                  keyboardType="decimal-pad"
                />
                <Text style={style.percent}>%</Text>
              </View>
              <Icon name="compare-arrows" containerStyle={style.compare} />
              <TextInput
                value={feeInput}
                onChangeText={this.changeStopPrice}
                style={[style.input, stopPriceErrorField === 0 && style.errorHighlight, style.fullInput]}
                keyboardType="decimal-pad"
              />
            </View>
            {!!stopPriceError && <Text style={[mainStyle.error, style.error]}>{stopPriceError}</Text>}
          </View>
        )}
      </View>
    );
  }

  renderTradeInfo() {
    const { inputToken, inputValue, outputToken, outputValue, inputBalance, prvBalance } = this.props;

    return (
      <View style={style.tradeInfo}>
        <View style={[mainStyle.twoColumns, style.tradeField]}>
          <View>
            <Text style={style.tradeValue} numberOfLines={1}>{formatUtil.amountFull(inputValue, inputToken.pDecimals)}</Text>
            <Text style={style.smallSymbol}>{inputToken.symbol}</Text>
          </View>
          <View style={style.tradeArrow}>
            <Image source={greyRightArrow} />
          </View>
          <View style={[mainStyle.textRight]}>
            <Text style={style.tradeValue} numberOfLines={1}>{formatUtil.amountFull(outputValue, outputToken.pDecimals)}</Text>
            <Text style={[style.smallSymbol, mainStyle.textRight]}>{outputToken.symbol}</Text>
          </View>
        </View>
        <View style={[mainStyle.twoColumns, style.tradeField]}>
          <View>
            <Text style={style.grey}>Balance:</Text>
            <View style={[mainStyle.twoColumns]}>
              <Text style={style.balanceValue} numberOfLines={1}>{formatUtil.amountFull(inputBalance, inputToken.pDecimals)}</Text>
              <Text style={style.balanceSymbol}>{inputToken.symbol}</Text>
            </View>
          </View>
          { inputToken.id !== PRV_ID && (
            <View style={[mainStyle.textRight]}>
              <View>
                <Text style={[style.grey, mainStyle.textRight]}>Balance:</Text>
                <View style={[mainStyle.twoColumns]}>
                  <Text style={[style.balanceValue, mainStyle.textRight]} numberOfLines={1}>{formatUtil.amountFull(prvBalance, PRV.pDecimals)}</Text>
                  <Text style={[style.balanceSymbol, mainStyle.textRight]}>PRV</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  }

  renderFee() {
    const { visible } = this.props;

    if (!visible) {
      return null;
    }

    return (
      <View style={style.feeWrapper}>
        {this.renderTradeInfo()}
        {this.renderNetworkFee()}
        {this.renderTradingFee()}
        {this.renderStopPrice()}
      </View>
    );
  }

  render() {
    const { visible, onClose, tradeError, sending } = this.props;
    const {
      networkFeeError,
      tradingFeeError,
      stopPriceError,
    } = this.state;
    return (
      <Overlay
        isVisible={visible}
        overlayStyle={[style.dialog, sending && mainStyle.hiddenDialog]}
        overlayBackgroundColor={sending ? 'transparent' : 'white'}
        windowBackgroundColor={`rgba(0,0,0,${ sending ? 0.8 : 0.5})`}
      >
        <View>
          <View style={[style.dialogContent, sending && mainStyle.hidden]}>
            <View style={[mainStyle.twoColumns, style.middle]}>
              <Text style={style.dialogTitle}>Confirm your trade details</Text>
              <TouchableOpacity style={style.closeIcon} onPress={onClose}>
                <Icon name="close" size={20} />
              </TouchableOpacity>
            </View>
            {this.renderFee()}
            <Button
              disabled={
                sending ||
                networkFeeError ||
                tradingFeeError ||
                stopPriceError
              }
              title="Confirm"
              onPress={this.trade}
            />
            {!!tradeError && <Text style={[mainStyle.error, style.error, style.chainError]}>{tradeError}</Text>}
          </View>
          <FullScreenLoading open={sending} />
        </View>
      </Overlay>
    );
  }
}

TradeConfirm.defaultProps = {
  inputToken: null,
  inputValue: null,
  outputToken: null,
  outputValue: null,
  visible: false,
  tradeError: '',
  sending: false,
  inputBalance: 0,
  prvBalance: 0,
};

TradeConfirm.propTypes = {
  inputToken: PropTypes.object,
  inputValue: PropTypes.number,
  outputToken: PropTypes.object,
  outputValue: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onTrade: PropTypes.func.isRequired,
  tradeError: PropTypes.string,
  sending: PropTypes.bool,
  inputBalance: PropTypes.number,
  prvBalance: PropTypes.number,
};

export default TradeConfirm;
