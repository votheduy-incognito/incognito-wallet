import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import accountService from '@src/services/wallet/accountService';
import { getPTokenList } from '@src/redux/actions/token';
import { setWallet } from '@src/redux/actions/wallet';
import { pTokens } from '@src/redux/selectors/token';
import PToken from '@src/models/pToken';
import SearchPToken from './SearchPToken';
import { Toast, ActivityIndicator, } from '../core';

export class SearchPTokenContainer extends PureComponent {
  state = {
    tokens: [],
  };

  componentDidMount() {
    this.getTokens()
      .then(this.getAvaiableTokens);
  }
  
  componentDidUpdate(prevProps) {
    const { pTokens: oldPTokens, followedTokens: oldFollowedTokens } = prevProps;
    const { pTokens, followedTokens } = this.props;

    if (oldPTokens !== pTokens || oldFollowedTokens !== followedTokens) {
      this.getAvaiableTokens();
    }
  }

  getAvaiableTokens = async () => {
    try {
      const { pTokens, followedTokens } = this.props;
      const followedTokenIds: Array = followedTokens.map(t => t?.id) || [];

      const tokens =  pTokens?.filter((pToken: PToken) => {
        return pToken.tokenId && !followedTokenIds.includes(pToken.tokenId);
      });

      this.setState({ tokens });

      return tokens || [];
    } catch {
      Toast.showError('Can not get list of tokens, please try later');
    }
  };

  handleAddFollowToken = async (tokenIds: Array) => {
    try {
      const { pTokens, account, wallet, setWallet } = this.props;
      const pTokenSelected = tokenIds.map(id => {
        const found : PToken = pTokens.find((pToken: PToken) => pToken.tokenId === id);
        return found.convertToToken();
      });

      await accountService.addFollowingTokens(pTokenSelected, account, wallet);

      Toast.showInfo('Added successfully');

      // update new wallet to store
      setWallet(wallet);
    } catch {
      Toast.showError(
        'Can not add these tokens to your account right now, please try later'
      );
    }
  };

  getTokens = async () => {
    try {
      const { getPTokenList } = this.props;
      await getPTokenList();
    } catch {
      Toast.showError('Can not get list of token');
    }
  }

  render() {
    const { tokens } = this.state;

    if (!tokens) return <ActivityIndicator />;

    return (
      <SearchPToken
        tokens={tokens}
        handleAddFollowToken={this.handleAddFollowToken}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  followedTokens: tokenSeleclor.followed(state),
  pTokens: pTokens(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

const mapDispatchToProps = {
  getPTokenList,
  setWallet
};

SearchPTokenContainer.defaultProps = {
  pTokens: null
};

SearchPTokenContainer.propTypes = {
  getPTokenList: PropTypes.func.isRequired,
  pTokens: PropTypes.arrayOf(PropTypes.object),
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchPTokenContainer);
