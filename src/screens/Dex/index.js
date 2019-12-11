import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import { setDefaultAccount } from '@src/redux/actions/account';
import { addHistory, getHistories, updateHistory, getHistoryStatus } from '@src/redux/actions/dex';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import dexUtils, {DEX} from '@utils/dex';
import { getTokenList } from '@services/api/token';
import { getPDEPairs } from '@services/wallet/RpcClientService';
import tokenService from '@services/wallet/tokenService';
import _ from 'lodash';
import { PRV } from '@screens/Dex/constants';
import { ExHandler } from '@services/exception';
import {accountSeleclor, selectedPrivacySeleclor} from '@src/redux/selectors';
import convertUtil from '@utils/convert';
import Dex from './Dex';

class DexContainer extends Component {
  state = {
    dexMainAccount: {},
    dexWithdrawAccount: {},
    accounts: [],
    tokens: [],
    pairTokens: [],
    pairs: [],
    loading: false,
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.listener = navigation.addListener('didFocus', this.loadData);
    this.loadData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);

    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
  }

  async updateAccount() {
    const { wallet } = this.props;
    let accounts = await wallet.listAccount();
    const dexMainAccount = accounts.find(item => item.AccountName === DEX.MAIN_ACCOUNT);
    const dexWithdrawAccount = accounts.find(item => item.AccountName === DEX.WITHDRAW_ACCOUNT);
    accounts = accounts.filter(account => !dexUtils.isDEXAccount(account.name || account.AccountName));
    this.setState({ dexMainAccount, dexWithdrawAccount, accounts });
  }

  loadData = async () => {
    const { getHistories } = this.props;
    const { loading } = this.state;

    if (loading) {
      return;
    }

    try {
      this.updateAccount();
      getHistories();
      this.setState({ loading: true });
      const pTokens = await getTokenList();
      const chainPairs = await getPDEPairs();
      const chainTokens = await tokenService.getPrivacyTokens();
      const tokens = [ PRV, ..._([...chainTokens, ...pTokens])
        .uniqBy(item => item.tokenId || item.id)
        .map(item => {
          const pToken = pTokens.find(token => token.tokenId === (item.tokenId || item.id ));
          return {
            ...item,
            id: item.tokenId || item.id,
            pDecimals: Math.min(pToken?.pDecimals || 0, 9),
            hasIcon: !!pToken,
            symbol: pToken?.pSymbol || item.symbol,
            name: pToken?  `Privacy ${pToken.name}` : `Incognito ${item.name}`,
          };
        })
        .orderBy(item => _.isString(item.symbol) && item.symbol.toLowerCase())
        .value()];
      const pairs = _(chainPairs.state.PDEPoolPairs)
        .map(pair => ({
          [pair.Token1IDStr]: pair.Token1PoolValue,
          [pair.Token2IDStr]: pair.Token2PoolValue,
          total: convertUtil.toRealTokenValue(tokens, pair.Token1IDStr, pair.Token1PoolValue) + convertUtil.toRealTokenValue(tokens, pair.Token2IDStr, pair.Token2PoolValue),
          keys: [pair.Token1IDStr, pair.Token2IDStr],
        }))
        .filter(pair => pair.total)
        .orderBy('total', 'desc')
        .value();
      const shares = chainPairs.state.PDEShares;
      const pairTokens = _(tokens)
        .filter(token => pairs.find(pair => pair.keys.includes(token.id)))
        .orderBy(['hasIcon', token => _.maxBy(pairs, pair => pair.keys.includes(token.id) ? pair.total : 0).total], ['desc', 'desc'])
        .value();
      this.setState({ pairs, pairTokens, tokens, shares });
    } catch(error) {
      new ExHandler(error).showErrorToast();
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      wallet,
      navigation,
      histories,
      addHistory,
      updateHistory,
      getHistoryStatus,
      getHistories,
      account,
      selectPrivacyByTokenID,
      followedTokens,
    } = this.props;
    const { dexMainAccount, dexWithdrawAccount, accounts, tokens, pairTokens, pairs, loading, shares } = this.state;

    if (!wallet) return <LoadingContainer />;

    return (
      <Dex
        wallet={wallet}
        navigation={navigation}
        histories={histories}
        onAddHistory={addHistory}
        onUpdateHistory={updateHistory}
        onGetHistoryStatus={getHistoryStatus}
        onGetHistories={getHistories}
        onSelectPrivacyByTokenID={selectPrivacyByTokenID}
        dexMainAccount={dexMainAccount}
        dexWithdrawAccount={dexWithdrawAccount}
        accounts={accounts}
        followedTokens={followedTokens}
        tokens={tokens}
        pairTokens={pairTokens}
        pairs={pairs}
        onLoadData={this.loadData}
        isLoading={loading}
        account={account}
        shares={shares}
      />
    );
  }
}

const mapState = state => ({
  followedTokens: state.token?.followed,
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  histories: state.dex.histories,
  selectPrivacyByTokenID: selectedPrivacySeleclor.getPrivacyDataByTokenID(state),
});

const mapDispatch = {
  setListToken,
  getBalance,
  getPTokenList,
  getInternalTokenList,
  setSelectedPrivacy,
  setDefaultAccount,
  getHistories,
  addHistory,
  updateHistory,
  getHistoryStatus,
};

DexContainer.propTypes = {
  account: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  histories: PropTypes.array.isRequired,
  getHistories: PropTypes.func.isRequired,
  addHistory: PropTypes.func.isRequired,
  updateHistory: PropTypes.func.isRequired,
  getHistoryStatus: PropTypes.func.isRequired,
  selectPrivacyByTokenID: PropTypes.func.isRequired,
  followedTokens: PropTypes.array.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(DexContainer);
