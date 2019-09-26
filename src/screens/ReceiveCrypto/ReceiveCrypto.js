import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Text } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { homeStyle } from './style';


class ReceiveCrypto extends React.Component {
  render() {
    const { selectedPrivacy } = this.props;

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <Text style={homeStyle.desc}>Simply scan this QR code from the sending wallet.</Text>
          <QrCodeAddress data={selectedPrivacy.paymentAddress} />
        </Container>
      </ScrollView>
    );
  }
}

ReceiveCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default ReceiveCrypto;
