import { CONSTANT_COMMONS } from '@src/constants';
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
import { change, destroy } from 'redux-form';
import accountService from '@services/wallet/accountService';
import {MESSAGES} from '@screens/Dex/constants';
import EstimateFee from './EstimateFee';

class EstimateFeeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGettingFee: false,
      estimateErrorMsg: null,
      userFee: undefined,  // high priority
      minFee: undefined,
    };

    this.handleEstimateFee = debounce(this.handleEstimateFee.bind(this), 1000);
  }

  componentDidMount() {
    // select default type
    this.selectDefaultFeeType();
  }

  componentDidUpdate(prevProps) {
    const { amount: oldAmount, estimateFeeData: { feeUnitByTokenId: oldFeeUnitByTokenId } } = prevProps;
    const { amount, estimateFeeData: { feeUnitByTokenId } } = this.props;

    // do estimate if amount or type of fee was changed
    if ((oldAmount !== amount) || (feeUnitByTokenId !== oldFeeUnitByTokenId)) {
      this.handleEstimateFee();
    }

    // select default type if hasnt been selected
    if (!feeUnitByTokenId) {
      this.selectDefaultFeeType();
    }
  }

  setUserFee = fee => {
    if (Number.isInteger(fee)) {
      this.setState({ userFee: fee });
    }
  }

  selectDefaultFeeType = () => {
    // select a type as default, priority: selectedPrivacy > PRV > first type
    const { types, selectedPrivacy } = this.props;

    const defaultType = types.find(t => t.tokenId === selectedPrivacy.tokenId) || types.find(t => t.tokenId === CONSTANT_COMMONS.PRV_TOKEN_ID) || types[0];

    if (defaultType) {
      this.handleNewFeeData({
        feeUnitByTokenId: defaultType.tokenId,
        feeUnit: defaultType.symbol
      });
    }
  }

  handleNewFeeData = ({ fee, feeUnitByTokenId, feeUnit } = {}) => {
    const { onNewFeeData, estimateFeeData } = this.props;

    // clear err msg and show loading if user changes type of fee
    if (feeUnitByTokenId) {
      this.setState({ estimateErrorMsg: null, isGettingFee: true });
    }

    if (typeof onNewFeeData === 'function') {
      onNewFeeData({
        ...estimateFeeData || {},
        ...fee !== undefined ? { fee } : {},
        ...feeUnitByTokenId !== undefined ? { feeUnitByTokenId } : {},
        ...feeUnit !== undefined ? { feeUnit } : {}
      });
    }
  }

  handleEstimateFee = async () => {
    let fee;
    let minFee;
    try {
      const { userFee } = this.state;
      const { selectedPrivacy, amount, toAddress, estimateFeeData: { feeUnitByTokenId }, multiply } = this.props;

      if (!amount || !toAddress || !selectedPrivacy) {
        return;
      }

      this.setState({ isGettingFee: true, estimateErrorMsg: null }, () => {
        this.handleNewFeeData({ fee: null });
      });

      if (feeUnitByTokenId === selectedPrivacy?.tokenId && selectedPrivacy.isToken) { // estimate fee in pToken [pETH, pBTC, ...]
        fee = await this._handleEstimateTokenFee();
      } else if (feeUnitByTokenId === CONSTANT_COMMONS.PRV_TOKEN_ID) {
        // estimate fee in PRV
        if (selectedPrivacy?.isToken) {
          fee = await this._estimateFeeForToken();
        }
        if (selectedPrivacy?.isMainCrypto) {
          fee = await this._estimateFeeForMainCrypto();
        }
      } else {
        throw new CustomError(ErrorCode.estimate_fee_does_not_support_type_of_fee);
      }

      fee = fee * multiply;
      minFee = fee;
      fee = userFee > fee ? userFee : fee;

      this.setState({ estimateErrorMsg: null });

      return fee;
    } catch (e) {
      const { onEstimateFailed, estimateFeeData: { feeUnit } } = this.props;
      if (accountService.isNotEnoughCoinErrorCode(e)) {
        this.setState({ estimateErrorMsg: MESSAGES.PENDING_TRANSACTIONS }, onEstimateFailed);
      } else {
        this.setState({
          estimateErrorMsg: new ExHandler(e, `Something went wrong while estimating ${feeUnit} fee for this transactions, please try again.`).message,
        }, onEstimateFailed);
      }
      fee = null;
      minFee = null;
    } finally {
      this.setState({ isGettingFee: false, minFee });
      this.handleNewFeeData({ fee });
    }
  };

  _estimateFeeForMainCrypto = async ()=> {
    try {
      const { account, wallet, selectedPrivacy, toAddress, amount, dexBalance } = this.props;
      const fromAddress = selectedPrivacy?.paymentAddress;
      const accountWallet = wallet.getAccountByName(account?.name);

      if (!selectedPrivacy.amount && !dexBalance) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

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
      const { account, wallet, selectedPrivacy, toAddress, amount, dexBalance } = this.props;
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

      if (!selectedPrivacy.amount && !dexBalance) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

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
      const { account, wallet, selectedPrivacy, toAddress, amount, dexBalance } = this.props;
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

      if (!selectedPrivacy.amount && !dexBalance) throw new CustomError(ErrorCode.estimate_fee_with_zero_balance);

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

  getFeeTypesByTokenId = memmoize((selectedPrivacy) => {
    const ids = [CONSTANT_COMMONS.PRV_TOKEN_ID];

    if (!ids.includes(selectedPrivacy?.tokenId)) {
      ids.unshift(selectedPrivacy?.tokenId);
    }
    return ids;
  })

  getPDecimals = memmoize((selectedPrivacy, defaultFeeTokenId) => {
    if (defaultFeeTokenId === CONSTANT_COMMONS.PRV_TOKEN_ID) {
      return CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY;
    }

    if (defaultFeeTokenId === selectedPrivacy?.tokenId) {
      return selectedPrivacy?.pDecimals;
    }

    return null;
  })

  render() {
    const { isGettingFee, estimateErrorMsg, minFee } = this.state;
    const { selectedPrivacy, style, account, feeText, estimateFeeData } = this.props;
    const { feeUnitByTokenId, fee, feeUnit } = estimateFeeData || {};
    const feePDecimals = this.getPDecimals(selectedPrivacy, feeUnitByTokenId);
    const txt = feeText ?? (fee && `${formatUtil.amountFull(fee, feePDecimals)} ${feeUnit}`);

    if (account && selectedPrivacy) {
      return (
        <EstimateFee
          {...this.props}
          isGettingFee={isGettingFee}
          estimateErrorMsg={estimateErrorMsg}
          onRetry={this.handleEstimateFee}
          onNewFeeData={this.handleNewFeeData}
          setUserFee={this.setUserFee}
          minFee={minFee}
          style={style}
          feeText={txt}
          feePDecimals={feePDecimals}
        />
      );
    }

    return null;
  }
}

const mapState = (state, props) => ({
  selectedPrivacy: props?.selectedPrivacy || selectedPrivacySeleclor.selectedPrivacy(state, props.dexToken),
  account: accountSeleclor.getAccountByName(state)(props.accountName),
  wallet: state.wallet,
});

const mapDispatch = { rfChange: change, rfDestroy: destroy };

EstimateFeeContainer.defaultProps = {
  selectedPrivacy: null,
  amount: null,
  toAddress: null,
  style: null,
  types: [{
    tokenId: CONSTANT_COMMONS.PRV_TOKEN_ID,
    symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
  }],
  feeText: null,
  onEstimateFailed: null,
  dexToken: null,
  dexBalance: 0,
  multiply: 1,
};

EstimateFeeContainer.propTypes = {
  account: PropTypes.object.isRequired,
  accountName: PropTypes.string.isRequired,
  wallet: PropTypes.object.isRequired,
  estimateFeeData: PropTypes.shape({
    fee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    feeUnit: PropTypes.string,
    feeUnitByTokenId: PropTypes.string
  }).isRequired,
  selectedPrivacy: PropTypes.object,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  toAddress: PropTypes.string,
  style: PropTypes.object,
  types: PropTypes.arrayOf(PropTypes.shape({
    tokenId: PropTypes.string,
    symbol: PropTypes.string
  })),
  feeText: PropTypes.string,
  onEstimateFailed: PropTypes.func,
  onNewFeeData: PropTypes.func.isRequired,
  dexToken: PropTypes.object,
  dexBalance: PropTypes.number,
  multiply: PropTypes.number,
};


export default connect(
  mapState,
  mapDispatch,
)(EstimateFeeContainer);
