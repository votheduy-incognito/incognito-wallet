import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import accountService from '@src/services/wallet/accountService';
import tokenService from '@src/services/wallet/tokenService';
import { getPTokenList } from '@src/redux/actions/token';
import { setWallet } from '@src/redux/actions/wallet';
import { pTokens } from '@src/redux/selectors/token';
import PToken from '@src/models/pToken';
import internalTokenModel from '@src/models/token';
import { ExHandler } from '@src/services/exception';
import { View } from 'react-native';
import { CONSTANT_COMMONS } from '@src/constants';
import { NETWORK_NAME_ID } from './TokenItem';
import SearchToken from './SearchToken';
import { Toast, ActivityIndicator, } from '../core';

const normalizeToken = ({ data, isPToken, isInternalToken }) => {
  if (isPToken) {
    const isPrivateToken = data?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.TOKEN;
    const isERC20 = isPrivateToken && data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.ERC20;
    const isBep2 = isPrivateToken && data?.currencyType === CONSTANT_COMMONS.PRIVATE_TOKEN_CURRENCY_TYPE.BNB_BEP2;
    const isPrivateCoin = data?.type === CONSTANT_COMMONS.PRIVATE_TOKEN_TYPE.COIN;
    let networkNameId;
    let networkName;

    if (isPrivateCoin) {
      networkNameId = NETWORK_NAME_ID.USE_COIN_NAME;
      networkName = `${data?.name} network`;
    } else if (isERC20) {
      networkNameId = NETWORK_NAME_ID.ERC20;
      networkName = 'ERC20 network';
    } else if (isBep2) {
      networkNameId = NETWORK_NAME_ID.BEP2;
      networkName = 'BEP2 network';
    }
    
    return ({
      tokenId: data?.tokenId,
      name: data?.name,
      symbol: data?.symbol,
      isPrivateToken,
      isPrivateCoin,
      isBep2,
      isERC20,
      networkNameId,
      networkName
    });
  }

  if (isInternalToken) {
    return ({
      tokenId: data?.id,
      name: data?.name,
      symbol: data?.symbol,
      isIncognitoToken: true,
      networkNameId: NETWORK_NAME_ID.INCOGNITO,
      networkName: 'Incognito network'
    });
  }
};

export class SearchTokenContainer extends PureComponent {
  state = {
    tokens: null,
    internalTokens: [],
    gettingToken: false,
  };

  componentDidMount() {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ gettingToken: true });
    Promise.all([
      this.getPTokens(),
      this.getInternalTokens()
    ])
      .then(() => this.setState({ gettingToken: false }))
      .catch(() => this.setState({ gettingToken: false }));
  }

  componentDidUpdate(prevProps, prevState) {
    const { pTokens: oldPTokens, followedTokens: oldFollowedTokens } = prevProps;
    const { pTokens, followedTokens } = this.props;
    const { internalTokens: oldInternalTokens } = prevState;
    const { internalTokens } = this.state;

    if (oldPTokens !== pTokens || oldFollowedTokens !== followedTokens || oldInternalTokens !== internalTokens) {
      this.getAvaiableTokens();
    }
  }

  getAvaiableTokens = async () => {
    try {
      const { internalTokens } = this.state;
      const { pTokens, followedTokens } = this.props;
      const followedTokenIds: Array = followedTokens.map(t => t?.id) || [];

      const normalizedTokens = [
        ...internalTokens
          ?.filter(t => !pTokens?.find(pToken => pToken.tokenId === t.id))
          ?.map(t => normalizeToken({ data: t, isInternalToken: true })) || [],
        ...pTokens?.map(t => normalizeToken({ data: t, isPToken: true })) || []
      ];

      const tokens = [];

      normalizedTokens?.forEach(token => {
        if (token?.name && token?.symbol && token.tokenId) {
          let _token = { ...token };

          if (followedTokenIds.includes(token.tokenId)) {
            _token.isFollowed = true;
          }

          tokens.push(_token);
        }
      });

      this.setState({ tokens });

      return tokens || [];
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };

  goBack = () => {
    const { navigation } = this.props;

    navigation?.pop();
  }

  handleAddFollowToken = async (tokenId: Array) => {
    const { pTokens, account, wallet, setWallet } = this.props;
    const { internalTokens } = this.state;
    const foundPToken : PToken = pTokens?.find((pToken: PToken) => pToken.tokenId === tokenId);
    const foundInternalToken = !foundPToken && internalTokens?.find(token => token.id === tokenId);
    
    const token = (foundInternalToken && internalTokenModel.toJson(foundInternalToken)) || foundPToken?.convertToToken();

    if (!token) throw new Error('Can not follow empty coin');

    await accountService.addFollowingTokens([token], account, wallet);

    Toast.showSuccess('Coin added');

    // update new wallet to store
    setWallet(wallet);
  }

  handleRemoveFollowToken = async tokenId => {
    const { account, wallet, setWallet } = this.props;
    const updatedWallet = await accountService.removeFollowingToken(tokenId, account, wallet);

    // update new wallet to store
    setWallet(updatedWallet);

    Toast.showInfo('Coin removed');
  }

  getPTokens = async () => {
    try {
      const { getPTokenList } = this.props;
      await getPTokenList();
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  }

  getInternalTokens = async () => {
    try {
      const internalTokens = await tokenService.getPrivacyTokens();
      this.setState({ internalTokens });

      return internalTokens;
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  }

  render() {
    const { tokens, gettingToken } = this.state;
    const { account, wallet, followedTokens } = this.props;

    if (!tokens || !account || !wallet || gettingToken) {
      return (
        <View style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <SearchToken
        {...this.props}
        tokens={tokens}
        followedTokens={followedTokens}
        handleAddFollowToken={this.handleAddFollowToken}
        handleRemoveFollowToken={this.handleRemoveFollowToken}
        onCancel={this.goBack}
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

SearchTokenContainer.defaultProps = {
  pTokens: [],
  followedTokens: []
};

SearchTokenContainer.propTypes = {
  getPTokenList: PropTypes.func.isRequired,
  pTokens: PropTypes.arrayOf(PropTypes.object),
  followedTokens: PropTypes.arrayOf(PropTypes.object),
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation
)(SearchTokenContainer);
