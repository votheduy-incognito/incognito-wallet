import React from 'react';
import TokenTabs from './TokenTabs';
import { View, Button, Container, TouchableOpacity, Text } from '@src/components/core';
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


  render(){
    const { listNormalTokens, listPrivacyTokens } = this.state;
    return (
      <View>
        <TokenTabs listNormalTokens={listNormalTokens} listPrivacyTokens={listPrivacyTokens} tabRef={ tab => this.tab = tab } />
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
};

export default Token;