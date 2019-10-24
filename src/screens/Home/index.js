import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance, reloadAccountFollowingToken } from '@src/redux/actions/account';
import { clearSelectedPrivacy, setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import APIService from '@src/services/api/miner/APIService';
import _ from 'lodash';
import { Toast } from '@src/components/core';
import Home from './Home';
import { DialogUpgradeToMainnet } from './ChildViews';

class HomeContainer extends Component {
  constructor(props) {
    super(props);

    const {navigation} = props;
    const { params } = navigation.state;
    const isNeedUpgrade = params?.isNeedUpgrade??false;
    this.state = {
      isReloading: false ,
      isNeedUpgrade:isNeedUpgrade
    };
  }

  async componentDidMount() {
    // temp
    this.removeOldTomo();

    const {isNeedUpgrade} = this.state;

    const { account, navigation, clearSelectedPrivacy } = this.props;
    // console.log('HIENTON account = ',account);
    try {
      if(isNeedUpgrade && !_.isEmpty(account)){
        APIService.airdrop1({WalletAddress:account.PaymentAddress}).then(result=>{
          result?.status == 1 && Toast.showSuccess('1 PRV has been added to your wallet.');
        });
      }
      this.getTokens();
      this.getFollowingToken();
      this.getAccountBalance(account);

      await Promise.all([
        this.getTokens(),
        this.getFollowingToken(),
        this.getAccountBalance(account),
      ]);
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }

    navigation.addListener(
      'didFocus',
      () => {
        clearSelectedPrivacy();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { wallet } = this.props;

    // reload tokens list if wallet was changed
    if (prevProps.wallet !== wallet) {
      this.getFollowingToken();
    }
  }

  getTokens = async () => {
    try {
      const { getPTokenList, getInternalTokenList } = this.props;
      await getPTokenList();
      await getInternalTokenList();
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not get list of tokens, reopen the app can fix it.');
    }
  };

  reload = async () => {
    try {
      this.setState({ isReloading: true });
      const { account } = this.props;
      const tasks = [
        this.getAccountBalance(account),
        this.getFollowingToken()
      ];

      await Promise.all(tasks);
    } catch (e) {
      new ExHandler(e).showErrorToast();
    } finally {
      this.setState({ isReloading: false });
    }
  };

  onAddTokenToFollow = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.FollowToken, { isPrivacy: true });
  };

  onCreateToken = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.CreateToken, { isPrivacy: true });
  };

  onSetting = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.Setting, { isPrivacy: true });
  };

  getTokenBalance = async token => {
    try {
      const { getBalance } = this.props;
      await getBalance(token);
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  };

  removeOldTomo = async () => {
    try {
      const tomoTokenId = 'ba1e1865f97bc445a87e61fcec0880237b3c1747768b713d6e1706fde25a8c93';
      const { account, wallet, setWallet } = this.props;
      const updatedWallet = await accountService.removeFollowingToken(tomoTokenId, account, wallet);

      // update new wallet to store
      setWallet(updatedWallet);
    } catch (e) {
      new ExHandler(e);
    }
  }

  getAccountBalance = async account => {
    try {
      const { getAccountBalance } = this.props;
      return getAccountBalance(account);
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  };

  getFollowingToken = async () => {
    try {
      const { account, reloadAccountFollowingToken } = this.props;
      const result = await reloadAccountFollowingToken(account);
      return result;
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, { rawError: e });
    }
  };

  handleSelectToken = (token) => {
    if (!token) return;

    const { setSelectedPrivacy, navigation } = this.props;

    setSelectedPrivacy(token?.id);

    navigation.navigate(routeNames.WalletDetail);
  };

  render() {
    const { isReloading,isNeedUpgrade } = this.state;
    const { wallet, account, tokens, accountGettingBalanceList, tokenGettingBalanceList } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <>
        <Home
          account={account}
          tokens={tokens}
          reload={this.reload}
          isReloading={isReloading}
          handleAddFollowToken={this.onAddTokenToFollow}
          handleCreateToken={this.onCreateToken}
          handleSetting={this.onSetting}
          accountGettingBalanceList={accountGettingBalanceList}
          tokenGettingBalanceList={tokenGettingBalanceList}
          onSelectToken={this.handleSelectToken}
        />
        <DialogUpgradeToMainnet
          isVisible={isNeedUpgrade}
          onButtonClick={()=>{
            this.setState({isNeedUpgrade:false});
          }}
        />
      </>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  accountGettingBalanceList: accountSeleclor.isGettingBalance(state),
  tokenGettingBalanceList: tokenSeleclor.isGettingBalance(state)
});

const mapDispatch = { setListToken, setWallet, getBalance, getAccountBalance, setSelectedPrivacy, clearSelectedPrivacy, reloadAccountFollowingToken, getPTokenList, getInternalTokenList };

HomeContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  tokenGettingBalanceList: PropTypes.array.isRequired,
  accountGettingBalanceList: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  clearSelectedPrivacy: PropTypes.func.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  getInternalTokenList: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
