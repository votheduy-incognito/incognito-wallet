import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingContainer from '@src/components/LoadingContainer';
import { getEstimateFeeService, getEstimateFeeForSendingTokenService } from '@src/services/wallet/RpcClientService';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';
import SendCrypto from './SendCrypto';

class SendCryptoContainer extends Component {
  constructor() {
    super();
    this.state = {
      isGettingFee: false,
      minFee: 0
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

  _handleSendMainPrivacy = values => {
    console.log(values);
  }

  _handleSendToken = values => {
    console.log(values);
  }

  handleSend = () => {
    const { selectedPrivacy } = this.props;

    if (selectedPrivacy?.isToken) return this._handleSendToken;
    if (selectedPrivacy?.isMainPrivacy) return this._handleSendMainPrivacy;
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { isGettingFee, minFee } = this.state;

    if (!selectedPrivacy) return <LoadingContainer />;

    const componentProps = {
      handleEstimateFee: this.handleEstimateFee(),
      handleSend: this.handleSend(),
      isGettingFee,
      minFee
    };

    return <SendCrypto {...this.props} {...componentProps} />;
  }
}

const mapState = state => ({
  selectedPrivacy: state.selectedPrivacy,
  account: state.account.defaultAccount,
  wallet: state.wallet
});

const mapDispatch = {  };

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
