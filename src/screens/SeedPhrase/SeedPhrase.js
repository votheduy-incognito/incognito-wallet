import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container } from '@src/components/core';
import CopiableText from '@src/components/CopiableText';
import styleSheet from './style';

const SeedPhrase = ({ seedPhrase }) => (
  <Container style={styleSheet.container}>
    <Text style={styleSheet.title}>Mnemonic -12 words</Text>
    <CopiableText text={seedPhrase} />
  </Container>
);

SeedPhrase.defaultProps = {
  seedPhrase: 'a b c d'
};

SeedPhrase.propTypes = {
  seedPhrase: PropTypes.string
};

export default SeedPhrase;