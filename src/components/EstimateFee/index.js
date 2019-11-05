import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { getEstimateFeeForNativeToken, getEstimateFeeForPToken } from '@src/services/wallet/RpcClientService';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import { debounce } from 'lodash';
import memmoize from 'memoize-one';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, Text } from '@src/components/core';
import EstimateFee from './EstimateFee';
import styles from './styles';

class EstimateFeeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      defaultFeeSymbol: null, // which currency use for fee
      minFee: null,
      isGettingFee: false,
      estimateErrorMsg: null,
    };

    this.handleEstimateFee = debounce(this.handleEstimateFee.bind(this), 1000);
  }

  componentDidMount() {
    const { types } = this.props;
    this.setFeeSymbol(types[0]);
    this.handleEstimateFee();
  }

  componentDidUpdate(prevProps) {
    const { amount: oldAmount, types: oldTypes } = prevProps;
    const { amount, toAddress, types } = this.props;

    if (oldTypes !== types) {
      this.setFeeSymbol(types[0]);
    }

    if (oldAmount !== amount && toAddress) {
      this.handleEstimateFee();
    }
  }

  handleEstimateFee = async () => {
    try {
      const { defaultFeeSymbol } = this.state;
      const { selectedPrivacy, amount, toAddress } = this.props;
      let fee;

      if (!amount || !toAddress || !selectedPrivacy || !defaultFeeSymbol) {
        return;
      }

      this.setState({ isGettingFee: true, estimateErrorMsg: null });
  
      if (defaultFeeSymbol === selectedPrivacy?.symbol) { // estimate fee in pToken [pETH, pBTC, ...]
        fee = await this._handleEstimateTokenFee();
      } else if (defaultFeeSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV) {
        // estimate fee in PRV
        if (selectedPrivacy?.isToken) {
          fee = await this._estimateFeeForToken();
        }
        if (selectedPrivacy?.isMainCrypto) {
          fee = await this._estimateFeeForMainCrypto();
        }
      }

      this.setState({ estimateErrorMsg: null, minFee: fee });

      return fee;
    } catch (e) {
      this.setState({
        estimateErrorMsg: new ExHandler(e, 'Something went wrong while estimating fee for this transactions, please try again.').message
      });
    } finally {
      this.setState({ isGettingFee: false });
    }
  }

  setFeeSymbol = symbol => {
    const { defaultFeeSymbol } = this.state;
    symbol !== defaultFeeSymbol && this.setState({ defaultFeeSymbol: symbol }, this.handleEstimateFee);
  }

  _estimateFeeForMainCrypto = async ()=> {
    try {
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);

      if (!selectedPrivacy.amount) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

      const fee = await getEstimateFeeForNativeToken(
        fromAddress,
        toAddress,
        convertUtil.toOriginalAmount(Number(amount), selectedPrivacy?.pDecimals),
        accountWallet,
      );
      
      return fee;
    } catch(e){
      throw e;
    }
  }

  _estimateFeeForToken = async () => {
    try{
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);
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

      if (!selectedPrivacy.amount) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

      const fee = await getEstimateFeeForPToken(
        fromAddress,
        toAddress,
        originalAmount,
        tokenObject,
        accountWallet,
      );
      
      return fee;
    } catch(e){
      throw e;
    }
  }

  _handleEstimateTokenFee = async () => {
    try{
      const { account, wallet, selectedPrivacy, toAddress, amount } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);
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

      if (!selectedPrivacy.amount) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

      const fee = await getEstimateFeeForPToken(
        fromAddress,
        toAddress,
        originalAmount,
        tokenObject,
        accountWallet,
        true, // get token fee flag
      );

      return fee;
    } catch(e){
      throw e;
    }
  }

  handleChangeDefaultSymbol = symbol => {
    this.setFeeSymbol(symbol);
  }

  getFeeSymbolList = memmoize((selectedPrivacy) => {
    const symbols = [CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV];

    // NOTE: dont support fake P.R.V(s)
    if (!symbols.includes(selectedPrivacy?.symbol)) {
      symbols.unshift(selectedPrivacy?.symbol);
    }
    return symbols;
  })

  getPDecimals = memmoize((selectedPrivacy, defaultFeeSymbol) => {
    if (defaultFeeSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV) {
      return CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY;
    }

    if (defaultFeeSymbol === selectedPrivacy?.symbol) {
      return selectedPrivacy?.pDecimals;
    }

    return null;
  })

  render() {
    const { minFee, isGettingFee, defaultFeeSymbol, estimateErrorMsg } = this.state;
    const { selectedPrivacy, onSelectFee, finalFee, style, account, types, feeText } = this.props;
    const pDecimals = this.getPDecimals(selectedPrivacy, defaultFeeSymbol);
    const txt = feeText ?? (finalFee && `You'll pay: ${formatUtil.amountFull(finalFee, pDecimals)} ${defaultFeeSymbol}`);

    if (typeof minFee !== 'undefined' && minFee !== null &&account && selectedPrivacy) {
      return (
        <>
          <EstimateFee
            onChangeDefaultSymbol={this.handleChangeDefaultSymbol}
            onSelectFee={onSelectFee}
            minFee={minFee}
            finalFee={finalFee}
            types={types || this.getFeeSymbolList(selectedPrivacy)}
            defaultFeeSymbol={defaultFeeSymbol}
            isGettingFee={isGettingFee}
            estimateErrorMsg={estimateErrorMsg}
            onRetry={this.handleEstimateFee}
            style={style}
            selectedPrivacy={selectedPrivacy}
            account={account}
          />
          <Text style={styles.feeText}>{txt}</Text>
        </>
        
      );
    }

    return null;
  }
}

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
});

EstimateFeeContainer.defaultProps = {
  selectedPrivacy: null,
  amount: null,
  toAddress: null,
  finalFee: null,
  style: null,
  types: [CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV],
  feeText: null,
};

EstimateFeeContainer.propTypes = {
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  finalFee:  PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  selectedPrivacy: PropTypes.object,
  onSelectFee: PropTypes.func.isRequired,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  toAddress: PropTypes.string,
  style: PropTypes.object,
  types: PropTypes.arrayOf(PropTypes.string),
  feeText: PropTypes.string,
};


export default connect(
  mapState
)(EstimateFeeContainer);