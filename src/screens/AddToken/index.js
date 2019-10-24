import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddERC20Token from '@src/components/AddERC20Token';

class AddToken extends Component {
  render() {
    const { navigation } = this.props;
    const type = navigation.getParam('type');
    console.log('TYPE', type);
    return (
      <AddERC20Token type={type} />
    );
  }
}

AddToken.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default AddToken;
