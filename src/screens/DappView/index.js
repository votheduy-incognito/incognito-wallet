import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Container, View } from '@src/components/core';
import { accountSeleclor, tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getBalance } from '@src/redux/actions/account';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import LoadingContainer from '@src/components/LoadingContainer';
import DappView from './DappView';

class DappViewContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedPrivacy: null,
      listSupportedToken: null
    };

    this.reloadBalanceTimeout = null;
  }

  componentDidMount() {
    this.handleSelectPrivacyToken(CONSTANT_COMMONS.PRV_TOKEN_ID);
    this.listSupportedToken();
  }

  componentWillUnmount() {
    if (this.reloadBalanceTimeout) {
      clearInterval(this.reloadBalanceTimeout);
      this.reloadBalanceTimeout = undefined;
    }
  }

  /**
   * duration in ms
   */
  reloadBalance = (tokenID, duration = 5 * 1000) => {
    // clear prev task
    if (this.reloadBalanceTimeout) {
      clearInterval(this.reloadBalanceTimeout);
    }

    this.reloadBalanceTimeout = setInterval(async () => {
      // account balance (PRV)
      if (tokenID === CONSTANT_COMMONS.PRV_TOKEN_ID) {
        const { getAccountBalanceBound, account } = this.props;
        await getAccountBalanceBound(account);
      } else if (tokenID) {
        const { getTokenBalanceBound, tokens } = this.props;
        const token = tokens?.find(t => t.id === tokenID);
        
        token && await getTokenBalanceBound(token);
      }
      this.getPrivacyToken(tokenID);
    }, duration);
  }

  handleSelectPrivacyToken = tokenID => {
    if (typeof tokenID === 'string') {
      this.setState({ tokenID }, () => {
        this.getPrivacyToken(tokenID);
        this.reloadBalance(tokenID);
      });
    } else {
      throw new Error('handleSelectPrivacyToken tokenID must be a tring');
    }
  }

  getPrivacyToken = tokenID => {
    const { selectPrivacyByTokenID } = this.props;
    const selectedPrivacy = selectPrivacyByTokenID(tokenID);
    
    if (selectedPrivacy) {
      this.setState({ selectedPrivacy });
    }
  }

  listSupportedToken = () => {
    const { tokens } = this.props;

    const list = [{
      [CONSTANT_COMMONS.PRV_TOKEN_ID]: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
    }];

    tokens?.forEach(token => {
      token?.id && list.push({ [token?.id]: token?.symbol });
    });

    this.setState({ listSupportedToken: list });
    return list;
  }

  render() {
    const { isSending, selectedPrivacy, listSupportedToken } = this.state;

    if (!selectedPrivacy || !listSupportedToken) {
      return <LoadingContainer />;
    }

    return (
      <>
        <DappView
          {...this.props}
          selectedPrivacy={selectedPrivacy}
          listSupportedToken={listSupportedToken}
          onSelectPrivacyToken={this.handleSelectPrivacyToken}
        />
        { isSending && <LoadingTx /> }
      </>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  selectPrivacyByTokenID: selectedPrivacySeleclor.getPrivacyDataByTokenID(state),
});

const mapDispatch = {
  getAccountBalanceBound: getBalance,
  getTokenBalanceBound: getTokenBalance
};

export default connect(mapState, mapDispatch)(DappViewContainer);