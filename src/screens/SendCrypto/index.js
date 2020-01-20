import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import {CONSTANT_COMMONS, CONSTANT_EVENTS} from '@src/constants';
import {logEvent} from '@services/firebase';
import SendCrypto from './SendCrypto';

class SendCryptoContainer extends Component {
  constructor() {
    super();
    this.state = {
      isSending: false,
      receiptData: null
    };
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    logEvent(CONSTANT_EVENTS.VIEW_SEND, {
      tokenId: selectedPrivacy.tokenId,
      tokenSymbol: selectedPrivacy.symbol,
    });
  }


  getTxInfo = ({ message } = {}) => message

  _handleSendMainCrypto = async values => {
    const { account, wallet, selectedPrivacy, getAccountBalanceBound } = this.props;
    const { toAddress, amount, fee, feeUnit, message } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const originalAmount = convertUtil.toOriginalAmount(convertUtil.toNumber(amount), selectedPrivacy?.pDecimals);
    const originalFee = convertUtil.toNumber(fee);

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: originalAmount
    }];

    const info = this.getTxInfo({ message });

    try {
      this.setState({
        isSending: true
      });

      const res = await accountService.createAndSendNativeToken(paymentInfos, originalFee, true, account, wallet, info);

      if (res.txId) {
        const receiptData = {
          title: 'Sent successfully',
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: originalAmount || 0,
          pDecimals: selectedPrivacy.pDecimals,
          decimals: selectedPrivacy.decimals,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee,
          feeUnit
        };

        this.setState({ receiptData });

        setTimeout(() => getAccountBalanceBound(account), 10000);
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSending: false });
    }
  }

  _handleSendToken = async values => {
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const { toAddress, amount, fee, feeUnit, message, isUseTokenFee } = values;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = convertUtil.toNumber(fee);
    const originalAmount = convertUtil.toOriginalAmount(convertUtil.toNumber(amount), selectedPrivacy?.pDecimals);
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

    const info = this.getTxInfo({ message });

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
        const receiptData = {
          title: 'Sent successfully',
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: originalAmount || 0,
          amountUnit: selectedPrivacy?.symbol,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee,
          feeUnit,
          pDecimals: selectedPrivacy?.pDecimals,
          decimals: selectedPrivacy.decimals,
        };

        this.setState({ receiptData });

        const foundToken = tokens?.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
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
  selectedPrivacy: null,
  tokens: null
};

SendCryptoContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object,
  getAccountBalanceBound: PropTypes.func.isRequired,
  getTokenBalanceBound: PropTypes.func.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
  mapState,
  mapDispatch
)(SendCryptoContainer);
