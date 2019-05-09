import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Home from './Home';

const HomeContainer = ({ defaultAccount }) => (
  <Home account={defaultAccount} />
);

const mapState = state => ({
  defaultAccount: state.accounts.find(_account => _account.default) 
});

HomeContainer.propTypes = {
  defaultAccount: PropTypes.object
};

export default connect(mapState)(HomeContainer);