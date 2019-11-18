import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddToken from './AddToken';

class AddTokenContainer extends Component {
  render() {
    return <AddToken />;
  }
}

AddToken.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddTokenContainer;
