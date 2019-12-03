import React, { Component } from 'react';
import { connect } from 'react-redux';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import FollowingTokenList from './FollowingTokenList';


class FollowingTokenListContainer extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <FollowingTokenList {...this.props} />
    );
  }
}

FollowingTokenListContainer.defaultProps = {
};

FollowingTokenListContainer.propTypes = {
};

const mapState = state => ({
  tokens: tokenSeleclor.followed(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  accountGettingBalanceList: accountSeleclor.isGettingBalance(state),
  tokenGettingBalanceList: tokenSeleclor.isGettingBalance(state),
  getAccountByName: accountSeleclor.getAccountByName(state)
});

export default connect(
  mapState,
)(FollowingTokenListContainer);
