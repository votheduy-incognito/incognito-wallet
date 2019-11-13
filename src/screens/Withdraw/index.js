import { Button, Container, Text } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { addERC20TxWithdraw, addETHTxWithdraw, genCentralizedWithdrawAddress } from '@src/services/api/withdraw';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { getMaxWithdrawAmountService } from '@src/services/wallet/RpcClientService';
import tokenService from '@src/services/wallet/tokenService';
import convertUtil from '@src/utils/convert';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SimpleInfo from '@src/components/SimpleInfo';
import Withdraw from './Withdraw';

class WithdrawContainer extends Component {
  constructor() {
    super();

    this.state = {
      withdrawData: null,
      isPreparing: false,
    };
  }

  componentDidMount() {
    this.getWithdrawData();
  }

  getTokenObject = ({ amount }) => {
    const { selectedPrivacy } = this.props;
    const fromAddress = selectedPrivacy?.paymentAddress;
    const toAddress = fromAddress; // est fee on the same network, dont care which address will be send to
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);

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

    return tokenObject;
  }

  getWithdrawData = async () => {
    try{
      this.setState({ isPreparing: true });
      const { account, wallet, selectedPrivacy } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const toAddress = fromAddress; // est fee on the same network, dont care which address will be send to
      const accountWallet = wallet.getAccountByName(account?.name);
      const selectedPrivacyAmount = selectedPrivacy?.amount;

      if (selectedPrivacyAmount <= 0) {
        return;
      }

      const tokenObject = this.getTokenObject({ amount: 0 });
      const isPrivacyForPrivateToken = selectedPrivacy.isDecentralized ? false : true;
      const data = await getMaxWithdrawAmountService(
        fromAddress,
        toAddress,
        tokenObject,
        accountWallet,
        isPrivacyForPrivateToken,
      );

      this.setState({ withdrawData: data });

      return data;
    } catch (e) {
      new ExHandler(e);
    } finally {
      this.setState({ isPreparing: false });
    }
  }

  handleSendToken = async ({ tempAddress, amount, fee, feeUnit }) => {
    const { withdrawData: { feeForBurn } } = this.state;
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
    const isTokenFee = feeUnit !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isTokenFee ? feeForBurn : 0),
      TokenReceivers: {
        PaymentAddress: tempAddress,
        Amount: originalAmount + (isTokenFee ? feeForBurn : 0)
      }
    };

    const paymentInfo = {
      paymentAddressStr: tempAddress,
      amount: feeForBurn,
    };

    try {
      const res = await tokenService.createSendPToken(
        tokenObject,
        !isTokenFee ? originalFee : 0,
        account,
        wallet,
        !isTokenFee  ? paymentInfo : null,
        isTokenFee ? originalFee : 0
      );

      if (res.txId) {
        const foundToken = tokens?.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);

        return res;
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    }
  }

  handleBurningToken = async ({ amount, fee, feeUnit, remoteAddress }) => {
    const { withdrawData: { feeForBurn } } = this.state;
    const { account, wallet, tokens, selectedPrivacy, getTokenBalanceBound } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
    const isTokenFee = feeUnit !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY;

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isTokenFee ? feeForBurn : 0),
      TokenReceivers: {
        PaymentAddress: '',
        Amount: originalAmount + (isTokenFee ? feeForBurn : 0)
      }
    };

    try {
      const res = await tokenService.createBurningRequest(
        tokenObject,
        !isTokenFee ? originalFee : 0,
        isTokenFee ? originalFee : 0,
        remoteAddress,
        account,
        wallet,
      );

      if (res.txId) {
        const foundToken = tokens?.find(t => t.id === selectedPrivacy?.tokenId);
        foundToken && setTimeout(() => getTokenBalanceBound(foundToken), 10000);

        return res;
      } else {
        throw new Error('Burned token, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    }
  }

  getWithdrawAddress = async ({ amount, paymentAddress }) => {
    try {
      let address;
      const { selectedPrivacy } = this.props;
      const walletAddress = selectedPrivacy?.paymentAddress;

      // centralized floW: BTC, BNB,...
      address = await genCentralizedWithdrawAddress({
        amount,
        paymentAddress,
        walletAddress,
        tokenId: selectedPrivacy?.tokenId,
        currencyType: selectedPrivacy?.currencyType,
      });
      
      return address;
    } catch (e) {
      throw new CustomError(ErrorCode.getStarted_load_device_token_failed, { rawError: e });
    }
  }

  handleCentralizedWithdraw = async ({ amount, paymentAddress, fee, feeUnit }) => {
    try {
      const tempAddress = await this.getWithdrawAddress({ amount, paymentAddress });
      return await this.handleSendToken({ tempAddress, amount, fee, feeUnit });
    } catch (e) {
      throw e;
    }
  }

  handleDecentralizedWithdraw = async ({ amount, fee, feeUnit, remoteAddress }) => {
    try {
      const { selectedPrivacy } = this.props;
      const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
      const tx = await this.handleBurningToken({ remoteAddress, amount, fee, feeUnit });

      // ERC20 
      if (selectedPrivacy?.isErc20Token) {
        return await addERC20TxWithdraw({
          amount,
          originalAmount,
          paymentAddress: remoteAddress,
          walletAddress: selectedPrivacy?.paymentAddress,
          tokenContractID: selectedPrivacy?.contractId,
          tokenId: selectedPrivacy?.tokenId,
          burningTxId: tx?.txId,
          currencyType: selectedPrivacy?.currencyType,
        });
      } else if (selectedPrivacy?.externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
        // ETH
        return await addETHTxWithdraw({
          amount,
          originalAmount,
          paymentAddress: remoteAddress,
          walletAddress: selectedPrivacy?.paymentAddress,
          tokenId: selectedPrivacy?.tokenId,
          burningTxId: tx?.txId,
          currencyType: selectedPrivacy?.currencyType,
        });
      }

      return null;
    } catch (e) {
      throw e;
    }
  }

  goToDeposit = () => {
    const { navigation } = this.props;
    navigation?.replace(routeNames.Deposit);
  }

  render() {
    const { selectedPrivacy } = this.props;
    const { withdrawData, isPreparing } = this.state;

    if (selectedPrivacy && selectedPrivacy?.amount <= 0) {
      return (
        <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ padding: 20, textAlign: 'center'}}>Please deposit more {selectedPrivacy?.symbol} to your wallet.</Text>
          <Button style={{ maxWidth: 200 }} title='Deposit' onPress={this.goToDeposit} />
        </Container>
      );
    }

    if (isPreparing) {
      return <LoadingContainer />;
    }

    if (!selectedPrivacy || !withdrawData) {
      return (
        <SimpleInfo
          type='warning'
          text='Hmm. We hit a snag. Please try again.'
          subText="If second time didnt work: We'll need to take a closer look at this. Please send a message to go@incognito.org or t.me/@incognitonode for assistance."
          button={
            <Button title='Try again' onPress={this.getWithdrawData} />
          }
        />
      );
    }

    return (
      <Withdraw
        {...this.props}
        withdrawData={withdrawData}
        handleCentralizedWithdraw={this.handleCentralizedWithdraw}
        handleDecentralizedWithdraw={this.handleDecentralizedWithdraw}
      />
    );
  }
}

const mapState = state => ({
  tokens: state.token?.followed,
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  wallet: state.wallet,
  account: accountSeleclor.defaultAccount(state)
});

const mapDispatch = { getTokenBalanceBound: getTokenBalance };

WithdrawContainer.defaultProps = {
  selectedPrivacy: null,
  tokens: null
};

WithdrawContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  getTokenBalanceBound: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
};


export default connect(
  mapState,
  mapDispatch
)(WithdrawContainer);
