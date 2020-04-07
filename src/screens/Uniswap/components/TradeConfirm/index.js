import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Button,
  Image,
  Text,
  View,
  TouchableOpacity,
  BaseTextInput as TextInput,
} from '@src/components/core';
import chevronRight from '@src/assets/images/icons/chevron_right.png';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import greyRightArrow from '@src/assets/images/icons/grey_right_arrow.png';
import {Overlay, Icon} from 'react-native-elements';
import Help from '@components/Help';
import FullScreenLoading from '@components/FullScreenLoading/index';
import {MESSAGES} from '../../constants';
import style from './style';
import { mainStyle } from '../../style';

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
      stopPrice: null,
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
    const { visible } = this.props;
    if (visible !== prevProps.visible && visible) {
      this.updateData();
    }
  }

  updateData() {
    const { outputValue, outputToken } = this.props;
    const stopPrice = outputValue - outputValue / 100;
    const stopPricePercent = 1;
    this.setState({
      stopPrice: formatUtil.amountFull(stopPrice, outputToken?.pDecimals),
      stopPricePercent: formatUtil.toFixed(stopPricePercent, 2),
      expandStopPrice: false,
    });
  }

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

  toggleStopPrice = () => {
    const { expandStopPrice } = this.state;
    this.setState({
      expandStopPrice: !expandStopPrice,
    });
  };

  trade = () => {
    const { onTrade } = this.props;
    const { stopPrice, stopPricePercent } = this.state;

    onTrade(stopPrice, stopPricePercent);
  };

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
    const {inputToken, inputValue, outputToken, outputValue} = this.props;

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
};

export default TradeConfirm;
