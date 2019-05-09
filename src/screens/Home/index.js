import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Home from './Home';

const HomeContainer = ({ defaultAccount, ...otherProps }) => (
  <Home account={defaultAccount} {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount
});

HomeContainer.propTypes = {
  defaultAccount: PropTypes.object,
};

export default connect(mapState)(HomeContainer);