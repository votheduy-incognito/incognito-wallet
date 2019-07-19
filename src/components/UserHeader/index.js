import React from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import UserHeader from './UserHeader';

const UserHeaderContainer = props => {
  const { defaultAccount, ...otherProps } = props;

  return <UserHeader userName={defaultAccount?.name} {...otherProps} />;
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state)
});

UserHeaderContainer.propTypes = {
  // defaultAccount: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(UserHeaderContainer);
