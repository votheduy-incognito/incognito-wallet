import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setDefaultAccount } from '@src/redux/actions/account';
import UserHeaderBoard from './UserHeaderBoard';

class UserHeaderBoardContainer extends Component {
  onHandleSwitchAccount = account => {
    const { setDefaultAccount } = this.props;

    setDefaultAccount(account);
  }

  render() {
    return (
      <UserHeaderBoard {...this.props} handleSwitchAccount={this.onHandleSwitchAccount} />
    );
  }
}

const mapState = state => ({
  defaultAccountName: state.account?.defaultAccount?.name,
  accountList: state.account?.list
});

const mapDispatch = { setDefaultAccount };

UserHeaderBoardContainer.propTypes = {
  setDefaultAccount: PropTypes.func
};

export default connect(mapState, mapDispatch)(UserHeaderBoardContainer);