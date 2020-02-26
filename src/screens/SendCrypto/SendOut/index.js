import { Button, Container, Text } from '@components/core/index';
import {CONSTANT_COMMONS, CONSTANT_EVENTS} from '@src/constants';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import routeNames from '@routers/routeNames';
import { addERC20TxWithdraw, addETHTxWithdraw, genCentralizedWithdrawAddress, updatePTokenFee } from '@services/api/withdraw';
import { getMinMaxWithdrawAmount } from '@services/api/misc';
import { ExHandler } from '@services/exception';
import tokenService from '@services/wallet/tokenService';
import convertUtil from '@utils/convert';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoadingContainer from '@components/LoadingContainer';
import SimpleInfo from '@components/SimpleInfo';
import {logEvent} from '@services/firebase';
import Withdraw from './Withdraw';

class WithdrawContainer extends Component {
  constructor() {
    super();

    this.state = {
      minAmount: null,
      maxAmount: null,
      isReady: false,
      hasError: false
    };
  }

  componentDidMount() {
    this.getMinMaxAmount();

    const { selectedPrivacy } = this.props;

    logEvent(CONSTANT_EVENTS.VIEW_WITHDRAW, {
      tokenId: selectedPrivacy?.tokenId,
      tokenSymbol: selectedPrivacy?.symbol,
    });
  }

  handleSendToken = async ({ tempAddress, amount, fee, isUsedPRVFee, feeForBurn }) => {
    const { account, wallet, selectedPrivacy } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
      TokenReceivers: [{
        PaymentAddress: tempAddress,
        Amount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn)
      }]
    };

    const paymentInfo = {
      paymentAddressStr: tempAddress,
      amount: feeForBurn,
    };

    const res = await tokenService.createSendPToken(
      tokenObject,
      isUsedPRVFee ? originalFee : 0,
      account,
      wallet,
      isUsedPRVFee  ? paymentInfo : null,
      isUsedPRVFee ? 0 : originalFee
    );

    if (res.txId) {
      return res;
    } else {
      throw new Error('Sent tx, but doesnt have txID, please check it');
    }
  };

  handleBurningToken = async ({ amount, fee, isUsedPRVFee, remoteAddress, feeForBurn }) => {
    const { account, wallet, selectedPrivacy } = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);

    const tokenObject = {
      Privacy : true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
      TokenReceivers: {
        PaymentAddress: '',
        Amount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn)
      }
    };

    try {
      const res = await tokenService.createBurningRequest(
        tokenObject,
        isUsedPRVFee ? originalFee : 0,
        isUsedPRVFee ? 0 : originalFee,
        remoteAddress,
        account,
        wallet,
      );

      if (res.txId) {
        return res;
      } else {
        throw new Error('Burned token, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    }
  };

  getMinMaxAmount = async () => {
    try {
      const { selectedPrivacy } = this.props;
      const [min, max] = await getMinMaxWithdrawAmount(selectedPrivacy?.tokenId);
      this.setState({ minAmount: min, maxAmount: max });
    } catch(e) {
      new ExHandler(e, 'Can not get min/max amount withdraw, please try again.').showErrorToast();
      this.setState({ hasError: true });
    } finally {
      this.setState({ isReady: true });
    }
  };

  getWithdrawAddress = async ({ amount, paymentAddress, memo }) => {
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
      memo
    });

    return address;
  }

  handleCentralizedWithdraw = async ({ amount, fee, isUsedPRVFee, feeForBurn, remoteAddress, memo }) => {
    try {
      const tempAddress = await this.getWithdrawAddress({ amount, paymentAddress: remoteAddress, memo });
      const tx = await this.handleSendToken({ tempAddress, amount, fee, isUsedPRVFee, feeForBurn });

      if (tx && !isUsedPRVFee) {
        await updatePTokenFee({ fee, paymentAddress: tempAddress });
      }

      return tx;
    } catch (e) {
      throw e;
    }
  }

  handleDecentralizedWithdraw = async ({ amount, fee, isUsedPRVFee, feeForBurn, remoteAddress }) => {
    try {
      const { selectedPrivacy } = this.props;
      const originalAmount = convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals);
      const tx = await this.handleBurningToken({ remoteAddress, amount, fee, isUsedPRVFee, feeForBurn });

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
  };

  goToDeposit = () => {
    const { navigation } = this.props;
    navigation?.replace(routeNames.Shield);
  };

  render() {
    const { selectedPrivacy } = this.props;
    const { minAmount, maxAmount, isReady, hasError } = this.state;

    if (!isReady) {
      return <LoadingContainer />;
    }

    if (selectedPrivacy && selectedPrivacy?.amount <= 0) {
      return (
        <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ padding: 20, textAlign: 'center'}}>Please deposit more {selectedPrivacy?.symbol} to your wallet.</Text>
          <Button style={{ maxWidth: 200 }} title='Deposit' onPress={this.goToDeposit} />
        </Container>
      );
    }

    if (!selectedPrivacy || hasError) {
      return (
        <SimpleInfo
          type='warning'
          text='Hmm. We hit a snag. Please re-open the app and try again.'
          subText="If second time didnt work: We'll need to take a closer look at this. Please send a message to go@incognito.org or t.me/@incognitonode for assistance."
        />
      );
    }

    return (
      <Withdraw
        {...this.props}
        minAmount={minAmount}
        maxAmount={maxAmount}
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
