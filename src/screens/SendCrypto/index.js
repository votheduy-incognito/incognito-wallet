import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { getEstimateFeeService, getEstimateFeeForSendingTokenService } from '@src/services/wallet/RpcClientService';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import tokenData from '@src/constants/tokenData';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { CONSTANT_COMMONS } from '@src/constants';
import SendCrypto from './SendCrypto';

class SendCryptoContainer extends Component {
  constructor() {
    super();
    this.state = {
      isGettingFee: false,
      isSending: false,
      minFee: 0,
      receiptData: null
    };
  }

  _estimateFeeMainPrivacy = async values => {
    const { account, wallet, selectedPrivacy } = this.props;
    const { toAddress, amount } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const accountWallet = wallet.getAccountByName(account?.name);

    try{
      this.setState({ isGettingFee: true });

      const fee = await getEstimateFeeService(
        fromAddress,
        toAddress,
        convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol),
        account?.PrivateKey,
        accountWallet,
        true // privacy mode
      );

      const humanFee = convertUtil.toHumanAmount(fee, tokenData.SYMBOL.MAIN_PRIVACY);
      // set min fee state
      this.setState({ minFee: humanFee });
    } catch(e){
      throw new Error('Error on get estimation fee!');
    } finally {
      this.setState({ isGettingFee: false });
    }
  }

  _estimateFeeToken = async values => {
    const { account, wallet, selectedPrivacy } = this.props;
    const { toAddress, amount } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const tokenFee = 0;
    const accountWallet = wallet.getAccountByName(account?.name);

    const tokenObject = {
      Privacy: true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
      TokenAmount: amount,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: amount
      }
    };

    try{
      this.setState({ isGettingFee: true });

      const fee = await getEstimateFeeForSendingTokenService(
        fromAddress,
        toAddress,
        convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol),
        tokenObject,
        account?.PrivateKey,
        accountWallet,
        true, // privacy mode
        tokenFee
      );
      const humanFee = convertUtil.toHumanAmount(fee, tokenData.SYMBOL.MAIN_PRIVACY);
      // set min fee state
      this.setState({ minFee: humanFee });
    } catch(e){
      throw new Error('Error on get estimation fee!');
    } finally {
      this.setState({ isGettingFee: false });
    }
  }

  handleEstimateFee = () => {
    const { selectedPrivacy } = this.props;

    if (selectedPrivacy?.isToken) return this._estimateFeeToken;
    if (selectedPrivacy?.isMainPrivacy) return this._estimateFeeMainPrivacy;
  }

  _handleSendMainPrivacy = async values => {
    const { account, wallet, selectedPrivacy, getAccountBalanceBound } = this.props;
    const { toAddress, amount, fee } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol);
    const originalFee = convertUtil.toOriginalAmount(Number(fee), tokenData.SYMBOL.MAIN_PRIVACY);

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
          amount: originalAmount,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee
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
    const { toAddress, amount, fee } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = convertUtil.toOriginalAmount(Number(fee), tokenData.SYMBOL.MAIN_PRIVACY);

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    try {
      this.setState({ isSending: true });

      const res = await tokenService.createSendPrivacyCustomToken(
        tokenObject,
        originalFee,
        account,
        wallet
      );

      if (res.txId) {
        const receiptData = {
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: Number(amount) || 0,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee
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
    if (selectedPrivacy?.isMainPrivacy) return this._handleSendMainPrivacy;
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { isGettingFee, minFee, receiptData, isSending } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    const componentProps = {
      handleEstimateFee: this.handleEstimateFee(),
      handleSend: this.handleSend(),
      isGettingFee,
      minFee,
      receiptData,
      isSending
    };

    return <SendCrypto {...this.props} {...componentProps} />;
  }
}

const mapState = state => ({
  selectedPrivacy: state.selectedPrivacy,
  account: state.account.defaultAccount,
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
