import React from 'react';
// import TokenTabs from './TokenTabs';
import { ScrollView, Container, Button } from '@src/components/core';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import TokenItem from './TokenItem';
import { CONSTANT_COMMONS } from '@src/constants';

class Token extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tokenTabType: CONSTANT_COMMONS.NORMAL_TOKEN_TAB,
      listNormalTokens: [],
      listPrivacyTokens: [],
    };
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

  handleInitToken = () => {
    const { navigation } = this.props;
    const { tokenTabType } = this.state;

    navigation.navigate( 
      ROUTE_NAMES.CreateSendToken, 
      {isPrivacy: tokenTabType === CONSTANT_COMMONS.PRIVACY_TOKEN_TAB, isCreate: true}
    );
  }

  // handleAddFollowingTokens(){
  //   //TODO
  // }


  render(){
    const { tokenTabType, listNormalTokens, listPrivacyTokens } = this.state;
    return (
      <ScrollView>
        {/* <TokenTabs /> */}
        <Container>
          <TokenList tokens={tokenTabType === CONSTANT_COMMONS.NORMAL_TOKEN_TAB ? listNormalTokens : listPrivacyTokens} />
        </Container> 
        <Button title='INIT NEW TOKEN' onPress={this.handleInitToken}></Button>
        <Button title='ADD TOKENS TO FOLLOW' onPress={this.handleAddFollowingTokens}></Button>
      </ScrollView>
    );
  }

}

Token.propTypes = {
  account: PropTypes.object,
  wallet: PropTypes.object,
  navigation: PropTypes.object,
};

const TokenList = ({ tokens }) => (
  <Container style={styleSheet.container}>
    {
      tokens && tokens.map(token => <TokenItem key={token.ID} token={token} />)
    }
  </Container>
);

TokenList.propTypes = {
  tokens: PropTypes.array,
};

export default Token;