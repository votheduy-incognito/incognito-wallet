import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import CreateToken from './CreateToken';

const CreateTokenContainer = ({
  wallet,
  defaultAccount,
  ...otherProps
}) => {
  return (
    <CreateToken
      wallet={wallet}
      account={defaultAccount}
      {...otherProps}
    />
  );
};

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet
});

CreateTokenContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object),
  isPrivacy: PropTypes.bool,
  isCreate: PropTypes.bool,
  navigation: PropTypes.objectOf(PropTypes.object)
};

export default connect(mapState)(CreateTokenContainer);
