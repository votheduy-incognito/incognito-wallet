import React from 'react';
// import TokenTabs from './TokenTabs';
import { ScrollView, Container, Button } from '@src/components/core';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import TokenItem from './TokenItem';

class Token extends React.Component {
  constructor(props) {
    super(props);

    // type 0 : privacy token; type 1: custom token
    this.state = {
      type: 0,
      listNormalTokens: [],
      listPrivacyTokens: [{ID: '1', Name: 'Token 1', Amount: '100'}],
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
  //TODO:
  // get list tokens
  componentDidMount(){
    this.loadFollowingTokens();
  }

  handleInitToken = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.CreateSendToken, {isPrivacy : false, isCreate: true});
  }

  // handleAddFollowingTokens(){
  //   //TODO
  // }


  render(){
    const { type, listNormalTokens, listPrivacyTokens } = this.state;
    return (
      <ScrollView>
        {/* <TokenTabs /> */}
        <Container>
          <Tokens tokens={type ? listNormalTokens : listPrivacyTokens} />
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

const Tokens = ({ tokens }) => (
  <Container style={styleSheet.container}>
    {
      tokens && tokens.map(token => <TokenItem key={token.ID} token={token} />)
    }
  </Container>
);



export default Token;