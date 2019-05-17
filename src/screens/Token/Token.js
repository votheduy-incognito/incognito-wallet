import React from 'react';
import TokenTabs from './TokenTabs';
import { View, Button, Container, TouchableOpacity, Text, Toast } from '@src/components/core';
import Account from '@src/services/wallet/accountService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@src/styles';
import { tokenStyle } from './style';

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      listNormalTokens: [],
      listPrivacyTokens: [],
    };

    this.tab = null;
  }

  loadFollowingTokens = async () => {
    const { account, wallet } = this.props;
    const followingTokens = await Account.getFollowingTokens(account, wallet);

    this.setState({
      listNormalTokens: followingTokens.filter(token => !token.IsPrivacy),
      listPrivacyTokens: followingTokens.filter(token => token.IsPrivacy),
    });
  }

  // getBalanceToken = async () => {

  // }

  componentDidMount(){
    this.loadFollowingTokens();
  }

  componentDidUpdate(prevProps) {
    if (this.shouldReloadListToken(prevProps)) {
      this.loadFollowingTokens();
    }
  }

  shouldReloadListToken = prevProps => this.props.account.name !== prevProps.account.name || this.props.wallet !== prevProps.wallet;

  handleInitToken = () => {
    const { navigation } = this.props;

    let isPrivacy = false;
    const key = this.tab?.getCurrentTabKey();
    if ( key === 'privacy'){
      isPrivacy = true;
    }

    navigation.navigate( 
      ROUTE_NAMES.CreateSendToken, 
      {isPrivacy, isCreate: true, reloadListFollowToken: this.loadFollowingTokens}
    );
  }

  handleAddFollowingTokens = () => {
    const { navigation } = this.props;
    let isPrivacy = false;
    const key = this.tab?.getCurrentTabKey();

    if ( key === 'privacy'){
      isPrivacy = true;
    }

    navigation.navigate(ROUTE_NAMES.FollowToken, { isPrivacy });
  }

  handleRemoveFollowToken = async tokenId => {
    try {
      const { account, wallet, setWallet } = this.props;
      await Account.removeFollowingToken(tokenId, account, wallet);

      // update new wallet to store
      setWallet(wallet);

      Toast.showInfo('Unfollowed');
    } catch {
      Toast.showError('Remove token failed, please try later');
    }
  }

  render(){
    const { listNormalTokens, listPrivacyTokens } = this.state;
    const { navigation, account, wallet } = this.props;

    const accountWallet = wallet.getAccountByName(account.name);

    return (
      <View>
        <TokenTabs 
          listNormalTokens={listNormalTokens} 
          listPrivacyTokens={listPrivacyTokens} 
          tabRef={ tab => this.tab = tab } 
          navigation={navigation} 
          accountWallet={accountWallet} 
          onRemoveFollowToken={this.handleRemoveFollowToken}
        />
        <Container>
          <TouchableOpacity
            style={tokenStyle.addFollowTokenBtn}
            onPress={this.handleAddFollowingTokens}
          >
            <MdIcons name='playlist-add' size={22} color={COLORS.green} />
            <Text style={tokenStyle.addFollowTokenBtnText}>ADD TOKENS TO FOLLOW</Text>
          </TouchableOpacity>
          <Button title='INIT NEW TOKEN' onPress={this.handleInitToken}></Button>
        </Container>
      </View>
    );
  }

}

Token.propTypes = {
  account: PropTypes.object,
  wallet: PropTypes.object,
  navigation: PropTypes.object,
  setWallet: PropTypes.func
};

export default Token;