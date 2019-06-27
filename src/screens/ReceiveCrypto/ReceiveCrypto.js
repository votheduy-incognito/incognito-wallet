import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView } from '@src/components/core';
import AccountAddress from './AccountAddress';
import { homeStyle } from './style';


class ReceiveCrypto extends React.Component {
  render() {
    const { selectedPrivacy } = this.props;

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <AccountAddress data={selectedPrivacy.paymentAddress} />
        </Container>
      </ScrollView>
    );
  }
}

ReceiveCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default ReceiveCrypto;
