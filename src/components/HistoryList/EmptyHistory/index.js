import { Container, Image, Text } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import noTransaction from '@assets/images/no_transaction.png';
import styles from './style';

const EmptyHistory = ({ actionButton }) => (
  <Container style={styles.container}>
    <Image source={noTransaction} style={styles.image} />
    {actionButton ?
      <>
        <Text style={styles.text}>Shield a public coin to start</Text>
        <Text style={styles.text}>transacting privately</Text>
        {actionButton}
      </>
      :
      <Text style={styles.text}>No transactions yet</Text>
    }
  </Container>
);

EmptyHistory.defaultProps = {
  actionButton: null
};

EmptyHistory.propTypes = {
  actionButton: PropTypes.element
};

export default EmptyHistory;
