import { Container, ScrollView, TouchableOpacity } from '@src/components/core';
import { CONSTANT_COMMONS, CONSTANT_CONFIGS } from '@src/constants';
import linkingService from '@src/services/linking';
import formatUtil from '@src/utils/format';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import styleSheet from './styles';

export default class TxHistoryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  renderText = ({ text, style, textProps }) => <Text style={style} numberOfLines={1} ellipsizeMode="tail" {...textProps}>{text}</Text>

  renderRow = ({ label, valueText, valueComponent, valueTextStyle, valueTextProps }) => {
    return (
      <View style={styleSheet.rowText}>
        {this.renderText({ text: `${label}:`, style: styleSheet.labelText })}
        {valueComponent ? valueComponent : this.renderText({ text: valueText, style: [styleSheet.valueText, valueTextStyle,], textProps: valueTextProps })}
      </View>
    );
  }

  renderTxId = txID => {
    return (
      <TouchableOpacity style={styleSheet.txButton} onPress={() => { linkingService.openUrl(`${CONSTANT_CONFIGS.EXPLORER_CONSTANT_CHAIN_URL}/tx/${txID}`); }}>
        {this.renderText({ text: txID, style: [styleSheet.valueText, styleSheet.txButtonText], textProps: { ellipsizeMode: 'middle' } })}
      </TouchableOpacity>
    );
  }

  render() {
    const { data } = this.props;
    const { typeText, balanceDirection, statusText, balanceColor, statusColor, statusNumber, history } = data;
    const isUseTokenFee = !!history?.feePToken;
    const fee = isUseTokenFee ? history?.feePToken : history?.fee;
    const feeUnit = isUseTokenFee ? history?.symbol : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    const formatFee = fee && formatUtil.amountFull(fee, isUseTokenFee ? history?.pDecimals : CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY);

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Icon type='material-community' name='history' style={styleSheet.icon} />
          {this.renderRow(
            {
              label: typeText,
              valueText: `${balanceDirection} ${history.amount
                ? formatUtil.amount(history.amount, history.pDecimals)
                : formatUtil.amount(history.requestedAmount)} ${history.symbol}`,
              valueTextStyle: { color: balanceColor }
            })
          }
          {!!fee && this.renderRow({ label: 'Fee', valueText: `${formatFee} ${feeUnit}` })}
          {!!statusText && this.renderRow({ label: 'Status', valueText: `${statusText} ${(!!statusNumber || statusNumber === 0) ? `[${statusNumber}]` : ''}`, valueTextStyle: { color: statusColor } })}
          {!!history?.time && this.renderRow({ label: 'Time', valueText: formatUtil.formatDateTime(history?.time) })}
          {!!history?.incognitoTx && this.renderRow({ label: 'Incognito TX', valueComponent: this.renderTxId(history?.incognitoTx) })}
          {!!history?.toAddress && this.renderRow({ label: 'To address', valueText: history?.toAddress, valueTextProps: { ellipsizeMode: 'middle' } })}
        </Container>
      </ScrollView>
    );
  }
}

TxHistoryDetail.propTypes = {
  data: PropTypes.shape({
    typeText: PropTypes.string,
    balanceDirection: PropTypes.string,
    statusText: PropTypes.string,
    balanceColor: PropTypes.string,
    statusColor: PropTypes.string,
    statusNumber: PropTypes.string,
    history: PropTypes.object
  }).isRequired
};