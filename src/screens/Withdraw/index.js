import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import { genWithdrawAddress } from '@src/services/api/withdraw';
import tokenService from '@src/services/wallet/tokenService';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { messageCode, createError, throwNext } from '@src/services/errorHandler';
import { getEstimateFeeForSendingTokenService } from '@src/services/wallet/RpcClientService';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import convertUtil from '@src/utils/convert';
import Withdraw from './Withdraw';

class WithdrawContainer extends Component {
  constructor() {
    super();
  }

  onEstimateFeeToken = async ({ amount }) => {
    const { account, wallet, selectedPrivacy } = this.props;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const toAddress = fromAddress; // est fee on the same network, dont care which address will be send to
    const tokenFee = 0;
    const accountWallet = wallet.getAccountByName(account?.name);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol);
    const selectedPrivacyAmount = selectedPrivacy?.amount;

    if (selectedPrivacyAmount <= 0) {
      throw createError({ code: messageCode.code.balance_must_not_be_zero });
    }

    const tokenObject = {
      Privacy: true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND,
      TokenAmount: originalAmount,
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: originalAmount
      }
    };

    try{
      const fee = await getEstimateFeeForSendingTokenService(
        fromAddress,
        toAddress,
        originalAmount,
        tokenObject,
        account?.PrivateKey,
        accountWallet,
        true, // privacy mode
        tokenFee
      );
      const humanFee = convertUtil.toHumanAmount(fee, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY);
      return humanFee;
    } catch (e) {
      throwNext(e, { defaultCode: messageCode.code.estimate_fee_failed });
    }
  }


  onSendToken = async ({ tempAddress, amount, fee }) => {
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = convertUtil.toOriginalAmount(Number(fee), tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.symbol);

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount,
      TokenReceivers: {
        PaymentAddress: tempAddress,
        Amount: originalAmount
      }
    };

    const paymentInfo = {
      paymentAddressStr: tempAddress,
      amount: originalFee,
    };

    try {
      const res = await tokenService.createSendPrivacyCustomToken(
        tokenObject,
        originalFee,
        account,
        wallet,
        paymentInfo
      );

      if (res.txId) {
        const foundToken = tokens.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);

        return res;
      } else {
        throw new Error(`Send token failed. Please try again! Detail: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      throw new Error(`Send token failed. Please try again! Detail:' ${e.message}`);
    }
  }

  getWithdrawAddress = async ({ amount, paymentAddress }) => {
    try {
      const { selectedPrivacy } = this.props;
      const currencyType = CONSTANT_COMMONS.CURRENCY_TYPE_FOR_GEN_ADDRESS[selectedPrivacy?.additionalData?.currencyType];
      const address = await genWithdrawAddress({
        currencyType,
        amount,
        paymentAddress
      });
      return address;
    } catch (e) {
      throw createError({ code: messageCode.code.gen_withdraw_address_failed });
    }
  }

  render() {
    const { selectedPrivacy } = this.props;

    if (!selectedPrivacy) return <LoadingContainer />;

    return (
      <Withdraw
        {...this.props}
        handleGenAddress={this.getWithdrawAddress}
        handleSendToken={this.onSendToken}
        handleEstimateFeeToken={this.onEstimateFeeToken}
      />
    );
  }
}

const mapState = state => ({
  tokens: state.token?.followed,
  selectedPrivacy: state.selectedPrivacy,
  wallet: state.wallet,
  account: state.account?.defaultAccount
});

const mapDispatch = { getTokenBalanceBound: getTokenBalance };

WithdrawContainer.defaultProps = {
  selectedPrivacy: null,
};

WithdrawContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
};


export default connect(
  mapState,
  mapDispatch
)(WithdrawContainer);
