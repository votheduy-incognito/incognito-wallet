import { Container, Image, Text } from '@src/components/core';
import React from 'react';
import noTransaction from '@assets/images/icons/shield.png';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import styles from './style';

const EmptyHistory = () => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  return (
    <Container style={styles.container}>
      <Image source={noTransaction} style={styles.image} />
      <Text style={styles.text}>
        {`Shield some ${selectedPrivacy?.externalSymbol ||
          selectedPrivacy?.symbol} to start\ntransacting anonymously.`}
      </Text>
    </Container>
  );
};

EmptyHistory.defaultProps = {};

EmptyHistory.propTypes = {};

export default EmptyHistory;
