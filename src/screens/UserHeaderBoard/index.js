import { setDefaultAccount } from '@src/redux/actions/account';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserHeaderBoard from './UserHeaderBoard';

class UserHeaderBoardContainer extends Component {
  onHandleSwitchAccount = account => {
    const { setDefaultAccount } = this.props;

    setDefaultAccount(account);
  };

  render() {
    return (
      <UserHeaderBoard
        {...this.props}
        handleSwitchAccount={this.onHandleSwitchAccount}
      />
    );
  }
}

const mapState = state => ({
  defaultAccountName: state.account?.defaultAccount?.name,
  accountList: state.account?.list,
  isGettingBalance: state.account?.isGettingBalance
});

const mapDispatch = { setDefaultAccount };
UserHeaderBoardContainer.defaultProps = {
  setDefaultAccount: undefined
};
UserHeaderBoardContainer.propTypes = {
  setDefaultAccount: PropTypes.func
};

export default connect(
  mapState,
  mapDispatch
)(UserHeaderBoardContainer);
