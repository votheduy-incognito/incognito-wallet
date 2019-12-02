import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, Container } from '@src/components/core';
import { accountSeleclor, tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import convertUtil from '@src/utils/convert';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { requestSendTxStyle } from './style';

class RequestSendTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false
    };
  }

  _handleSendNativeToken = async ({ toAddress, amount, fee }) => {
    const { selectedPrivacy, account, wallet } = this.props;
    fee = fee || 0.002 * 1e9;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), 9);
    const originalFee = Number(fee);

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: originalAmount
    }];

    try {
      this.setState({
        isSending: true
      });
      
      const res = await accountService.createAndSendNativeToken(paymentInfos, originalFee, true, account, wallet);
      if (res.txId) {
        return res;
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSending: false });
    }
  }

  _handleSendToken = async ({ toAddress, amount, feeUnit, fee }) => {
    const { selectedPrivacy, account, wallet } = this.props;
    feeUnit = feeUnit || selectedPrivacy?.symbol;
    fee = 0;

    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const isUseTokenFee = feeUnit !== CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount,
      TokenReceivers: [{
        PaymentAddress: toAddress,
        Amount: originalAmount
      }]
    };

    try {
      this.setState({ isSending: true });
      const res = await tokenService.createSendPToken(
        tokenObject,
        isUseTokenFee ? 0 : originalFee,
        account,
        wallet,
        null,
        isUseTokenFee ? originalFee : 0,
      );

      if (res.txId) {
        return res;
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSending: false });
    }
  }

  handleSendTx = async () => {
    try {
      const { selectedPrivacy, toAddress, amount, pendingTxId, onSendSuccess, onSendFailed } = this.props;
      let sendFn;
      
      if (selectedPrivacy?.isToken) sendFn = this._handleSendToken;
      if (selectedPrivacy?.isMainCrypto) sendFn = this._handleSendNativeToken;

      const res = await sendFn({ toAddress, amount, pendingTxId });
      onSendSuccess(res);
    } catch (e) {
      const { onSendFailed } = this.props;
      onSendFailed(e);
      new ExHandler(e).showErrorToast();
    }
  }

  renderData = (label, value) => {
    return (
      <View style={requestSendTxStyle.infoContainer}>
        <Text style={requestSendTxStyle.infoLabel}>{label}</Text>
        <Text style={requestSendTxStyle.infoValue}>{value}</Text>
      </View>
    );
  }

  render() {
    const { isSending } = this.state;
    const { onCancel, selectedPrivacy, toAddress, amount, url } = this.props;
    return (
      <Container style={requestSendTxStyle.container}>
        <Text style={requestSendTxStyle.title}> REQUEST SEND TX </Text>
        {this.renderData('DAPP URL', url)}
        {this.renderData('To address', toAddress)}
        {this.renderData('Amount', `${amount} ${selectedPrivacy?.symbol}`)}

        <View style={requestSendTxStyle.groupBtn}>
          <Button style={requestSendTxStyle.cancelBtn} title='Cancel' onPress={onCancel} />
          <Button style={requestSendTxStyle.submitBtn} title='Confirm Send' onPress={this.handleSendTx} />
        </View>
        { isSending && <LoadingTx /> }
      </Container>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  selectPrivacyByTokenID: selectedPrivacySeleclor.getPrivacyDataByTokenID(state),
});

const mapDispatch = {
};

export default connect(mapState, mapDispatch)(RequestSendTx);