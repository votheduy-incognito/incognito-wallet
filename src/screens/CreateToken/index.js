import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
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
  defaultAccount: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

CreateTokenContainer.defaultProps = {
  isPrivacy: true,
  isCreate: false,
};

CreateTokenContainer.propTypes = {
  defaultAccount: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  isPrivacy: PropTypes.bool,
  isCreate: PropTypes.bool,
  navigation: PropTypes.object.isRequired
};

export default connect(mapState)(CreateTokenContainer);
