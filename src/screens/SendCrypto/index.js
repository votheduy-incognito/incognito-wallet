import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import tokenData from '@src/constants/tokenData';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { CONSTANT_COMMONS } from '@src/constants';
import SendCrypto from './SendCrypto';

class SendCryptoContainer extends Component {
  constructor() {
    super();
    this.state = {
      isSending: false,
      receiptData: null
    };
  }

  _handleSendMainCrypto = async values => {
    const { account, wallet, selectedPrivacy, getAccountBalanceBound } = this.props;
    const { toAddress, amount, fee, feeUnit } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
    const originalFee = Number(fee);

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: originalAmount
    }];

    try {
      this.setState({
        isSending: true
      });
      
      const res = await accountService.sendConstant(paymentInfos, originalFee, true, account, wallet);

      if (res.txId) {
        const receiptData = {
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: originalAmount || 0,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee,
          feeUnit
        };

        this.setState({ receiptData });

        setTimeout(() => getAccountBalanceBound(account), 10000);
      } else {
        throw new Error(`Sent failed. Please try again! Detail: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      throw new Error(`Sent failed. Please try again! Detail:' ${e.message}`);
    } finally {
      this.setState({ isSending: false });
    }
  }

  _handleSendToken = async values => {
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const { toAddress, amount, fee, feeUnit } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const isUseTokenFee = feeUnit !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: originalAmount
      }
    };

    try {
      this.setState({ isSending: true });
      const res = await tokenService.createSendPrivacyCustomToken(
        tokenObject,
        isUseTokenFee ? 0 : originalFee,
        account,
        wallet,
        null,
        isUseTokenFee ? originalFee : 0,
      );

      if (res.txId) {
        const receiptData = {
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: originalAmount || 0,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee,
          feeUnit,
          pDecimals: selectedPrivacy?.pDecimals,
        };

        this.setState({ receiptData });
        
        const foundToken = tokens.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);
      } else {
        throw new Error(`Send token failed. Please try again! Detail: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      throw new Error(`Send token failed. Please try again! Detail:' ${e.message}`);
    } finally {
      this.setState({ isSending: false });
    }
  }

  handleSend = () => {
    const { selectedPrivacy } = this.props;

    if (selectedPrivacy?.isToken) return this._handleSendToken;
    if (selectedPrivacy?.isMainCrypto) return this._handleSendMainCrypto;
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { receiptData, isSending } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    const componentProps = {
      handleSend: this.handleSend(),
      receiptData,
      isSending
    };

    return <SendCrypto {...this.props} {...componentProps} />;
  }
}

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: state.token.followed
});

const mapDispatch = {
  getAccountBalanceBound: getBalance,
  getTokenBalanceBound: getTokenBalance
};

SendCryptoContainer.defaultProps = {
  selectedPrivacy: null
};

SendCryptoContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object,
};

export default connect(
  mapState,
  mapDispatch
)(SendCryptoContainer);
