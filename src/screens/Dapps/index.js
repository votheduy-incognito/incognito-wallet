import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Container } from '@src/components/core';
import { accountSeleclor } from '@src/redux/selectors';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';

import Dapps from './Dapps';

class DappsContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSending: false
    };
  }

  componentDidMount() {
    const { account, getAccountBalanceBound } = this.props;
    setInterval(() => {
      getAccountBalanceBound(account);
    }, 10000);
  }

  _handleSendNativeToken = async ({ toAddress, amount, fee, feeUnit }) => {
    const { account, wallet, getAccountBalanceBound } = this.props;
    const fromAddress = account?.PaymentAddress;
    const originalAmount = convertUtil.toOriginalAmount(Number(amount), 9);
    const originalFee = Number(fee);

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: originalAmount
    }];

    try {
      this.setState({
        isSending: true
      });
      
      const res = await accountService.createAndSendNativeToken(paymentInfos, originalFee, true, account, wallet);
      if (res.txId) {
        const receiptData = {
          title: 'Sent successfully',
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: originalAmount || 0,
          pDecimals: 9,
          decimals: 9,
          amountUnit: 'PRV',
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: originalFee,
          feeUnit
        };

        return res;
      } else {
        throw new Error('Sent tx, but doesnt have txID, please check it');
      }
    } catch (e) {
      throw e;
    } finally {
      this.setState({ isSending: false });
    }
  }

  handleSendTx = (toAddress, amount) => {
    // fake fee
    const fee = 0.0001;
    const feeUnit = 'PRV';
    return this._handleSendNativeToken({ toAddress, amount, fee, feeUnit });
  }

  render() {
    const { isSending } = this.state;
    return (
      <Container>
        <Dapps
          {...this.props}
          handleSendTx={this.handleSendTx}
        />
        { isSending && <LoadingTx /> }
      </Container>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: state.token.followed
});

const mapDispatch = {
  getAccountBalanceBound: getBalance,
  getTokenBalanceBound: getTokenBalance
};

export default connect(mapState, mapDispatch)(DappsContainer);