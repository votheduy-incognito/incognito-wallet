import {CONSTANT_COMMONS, CONSTANT_EVENTS, CONSTANT_KEYS} from '@src/constants';
import {getBalance as getTokenBalance} from '@src/redux/actions/token';
import {
  genCentralizedWithdrawAddress,
  updatePTokenFee,
  withdraw,
} from '@services/api/withdraw';
import {getMinMaxWithdrawAmount} from '@services/api/misc';
import {ExHandler} from '@services/exception';
import tokenService from '@services/wallet/tokenService';
import convertUtil from '@utils/convert';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import LoadingContainer from '@components/LoadingContainer';
import SimpleInfo from '@components/SimpleInfo';
import {logEvent} from '@services/firebase';
import {change as rfOnChangeValue} from 'redux-form';
import routeNames from '@src/router/routeNames';
import {withdrawReceiversSelector} from '@src/redux/selectors/receivers';
import {HEADER_TITLE_RECEIVERS} from '@src/redux/types/receivers';
import LocalDatabase from '@utils/LocalDatabase';
import Withdraw, {formName} from './Withdraw';

class WithdrawContainer extends Component {
  constructor() {
    super();

    this.state = {
      minAmount: null,
      maxAmount: null,
      isReady: false,
      hasError: false,
    };
  }

  async componentDidMount() {
    this.getMinMaxAmount();

    const {selectedPrivacy} = this.props;

    logEvent(CONSTANT_EVENTS.VIEW_WITHDRAW, {
      tokenId: selectedPrivacy?.tokenId,
      tokenSymbol: selectedPrivacy?.symbol,
    });
  }

  handleSendToken = async ({
    tempAddress,
    amount,
    fee,
    isUsedPRVFee,
    feeForBurn,
  }) => {
    const {account, wallet, selectedPrivacy} = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(
      Number(amount),
      selectedPrivacy?.pDecimals,
    );

    const tokenObject = {
      Privacy: true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
      TokenReceivers: [
        {
          PaymentAddress: tempAddress,
          Amount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
        },
      ],
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
      isUsedPRVFee ? paymentInfo : null,
      isUsedPRVFee ? 0 : originalFee,
    );

    if (res.txId) {
      return res;
    } else {
      throw new Error('Sent tx, but doesnt have txID, please check it');
    }
  };

  handleBurningToken = async ({
    amount,
    fee,
    isUsedPRVFee,
    remoteAddress,
    feeForBurn,
  }) => {
    const {account, wallet, selectedPrivacy} = this.props;
    const type = CONSTANT_COMMONS.TOKEN_TX_TYPE.SEND;
    const originalFee = Number(fee);
    const originalAmount = convertUtil.toOriginalAmount(
      Number(amount),
      selectedPrivacy?.pDecimals,
    );

    const tokenObject = {
      Privacy: true,
      TokenID: selectedPrivacy?.tokenId,
      TokenName: selectedPrivacy?.name,
      TokenSymbol: selectedPrivacy?.symbol,
      TokenTxType: type,
      TokenAmount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
      TokenReceivers: {
        PaymentAddress: '',
        Amount: originalAmount + (isUsedPRVFee ? 0 : feeForBurn),
      },
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
      const {selectedPrivacy} = this.props;
      const [min, max] = await getMinMaxWithdrawAmount(
        selectedPrivacy?.tokenId,
      );
      this.setState({minAmount: min, maxAmount: max});
    } catch (e) {
      new ExHandler(
        e,
        'Can not get min/max amount withdraw, please try again.',
      ).showErrorToast();
      this.setState({hasError: true});
    } finally {
      this.setState({isReady: true});
    }
  };

  getWithdrawAddress = async ({amount, paymentAddress, memo}) => {
    let address;
    const {selectedPrivacy} = this.props;
    const walletAddress = selectedPrivacy?.paymentAddress;

    // centralized floW: BTC, BNB,...
    address = await genCentralizedWithdrawAddress({
      amount,
      paymentAddress,
      walletAddress,
      tokenId: selectedPrivacy?.tokenId,
      currencyType: selectedPrivacy?.currencyType,
      memo,
    });

    return address;
  };

  handleCentralizedWithdraw = async ({
    amount,
    fee,
    isUsedPRVFee,
    feeForBurn,
    remoteAddress,
    memo,
  }) => {
    try {
      const tempAddress = await this.getWithdrawAddress({
        amount,
        paymentAddress: remoteAddress,
        memo,
      });
      const tx = await this.handleSendToken({
        tempAddress,
        amount,
        fee,
        isUsedPRVFee,
        feeForBurn,
      });

      if (tx && !isUsedPRVFee) {
        await updatePTokenFee({fee, paymentAddress: tempAddress});
      }

      return tx;
    } catch (e) {
      throw e;
    }
  };

  handleDecentralizedWithdraw = async ({
    amount,
    fee,
    isUsedPRVFee,
    feeForBurn,
    remoteAddress,
  }) => {
    try {
      const {selectedPrivacy} = this.props;
      const originalAmount = convertUtil.toOriginalAmount(
        Number(amount),
        selectedPrivacy?.pDecimals,
      );
      const tx = await this.handleBurningToken({
        remoteAddress,
        amount,
        fee,
        isUsedPRVFee,
        feeForBurn,
      });

      const data = {
        amount,
        originalAmount,
        paymentAddress: remoteAddress,
        walletAddress: selectedPrivacy?.paymentAddress,
        tokenContractID: selectedPrivacy?.contractId,
        tokenId: selectedPrivacy?.tokenId,
        burningTxId: tx?.txId,
        currencyType: selectedPrivacy?.currencyType,
        isErc20Token: selectedPrivacy?.isErc20Token,
        externalSymbol: selectedPrivacy?.externalSymbol,
      };

      await LocalDatabase.addWithdrawalData(data);
      await withdraw(data);
      await LocalDatabase.removeWithdrawalData(data.burningTxId);

      return tx;
    } catch (e) {
      throw e;
    }
  };

  onShowFrequentReceivers = async () => {
    const {navigation} = this.props;
    try {
      navigation.navigate(routeNames.FrequentReceivers, {
        keySave: CONSTANT_KEYS.REDUX_STATE_RECEIVERS_OUT_NETWORK,
        onSelectedItem: this.onSelectedItem,
        headerTitle: HEADER_TITLE_RECEIVERS.ADDRESS_BOOK,
      });
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  onSelectedItem = info => {
    const {rfOnChangeValue, navigation} = this.props;
    rfOnChangeValue(formName, 'toAddress', info.address);
    navigation.pop();
  };

  render() {
    const {selectedPrivacy} = this.props;
    const {minAmount, maxAmount, isReady, hasError} = this.state;

    if (!isReady) {
      return <LoadingContainer />;
    }

    if (!selectedPrivacy || hasError) {
      return (
        <SimpleInfo
          type="warning"
          text="Hmm. We hit a snag. Please re-open the app and try again."
          subText="If second time didnt work: We'll need to take a closer look at this. Please send a message to go@incognito.org or t.me/@incognitonode for assistance."
        />
      );
    }

    return (
      <Withdraw
        {...{
          ...this.props,
          onShowFrequentReceivers: this.onShowFrequentReceivers,
        }}
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
  receivers: withdrawReceiversSelector(state).receivers,
});

const mapDispatch = {getTokenBalanceBound: getTokenBalance, rfOnChangeValue};

WithdrawContainer.defaultProps = {
  selectedPrivacy: null,
  tokens: null,
};

WithdrawContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  getTokenBalanceBound: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
  rfOnChangeValue: PropTypes.func.isRequired,
  receivers: PropTypes.any.isRequired,
};

export default connect(mapState, mapDispatch)(WithdrawContainer);
