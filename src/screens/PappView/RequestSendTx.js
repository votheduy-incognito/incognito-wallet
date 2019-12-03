import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, Button, Container } from '@src/components/core';
import { accountSeleclor, tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import formatUtil from '@src/utils/format';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import { ExHandler } from '@src/services/exception';
import { requestSendTxStyle } from './style';

const DEFAULT_FEE = 30; // in nano

class RequestSendTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false
    };
  }

  _handleSendNativeToken = async ({ toAddress, nanoAmount, fee, info }) => {
    const { account, wallet } = this.props;
    fee = fee || DEFAULT_FEE;
    const originalAmount = nanoAmount;
    const originalFee = Number(fee);

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: originalAmount
    }];

    try {
      this.setState({
        isSending: true
      });

      const res = await accountService.createAndSendNativeToken(paymentInfos, originalFee, true, account, wallet, info);
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

  _handleSendToken = async ({ toAddress, nanoAmount, feeUnit, fee, info }) => {
    const { selectedPrivacy, account, wallet } = this.props;
    feeUnit = feeUnit || selectedPrivacy?.symbol;
    fee = fee || DEFAULT_FEE;

    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const isUseTokenFee = false; //feeUnit !== CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
    const originalAmount = nanoAmount;
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
        info
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
      const { selectedPrivacy, toAddress, amount, info, pendingTxId, onSendSuccess } = this.props;
      let sendFn;
      if (selectedPrivacy?.isToken) sendFn = this._handleSendToken;
      if (selectedPrivacy?.isMainCrypto) sendFn = this._handleSendNativeToken;

      const res = await sendFn({ toAddress, nanoAmount: amount, pendingTxId, info });
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
    const fee = DEFAULT_FEE; // default in PRV

    return (
      <Container style={requestSendTxStyle.container}>
        <Text style={requestSendTxStyle.title}> REQUEST SEND TX </Text>
        {this.renderData('PAPP URL', url)}
        {this.renderData('To address', toAddress)}
        {this.renderData('Amount', `${formatUtil.amount(amount, selectedPrivacy?.pDecimals)} ${selectedPrivacy?.symbol}`)}
        {this.renderData('Fee', `${formatUtil.amount(fee, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY)} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}`)}

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

RequestSendTx.defaultProps = {
  info: null
};

RequestSendTx.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSendSuccess: PropTypes.func.isRequired,
  onSendFailed: PropTypes.func.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  toAddress: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  info: PropTypes.string,
  url: PropTypes.string.isRequired,
  pendingTxId: PropTypes.number.isRequired,
};

export default connect(mapState, mapDispatch)(RequestSendTx);