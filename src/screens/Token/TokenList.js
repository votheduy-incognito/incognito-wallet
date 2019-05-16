import React from 'react';
import { Container } from '@src/components/core';
import styleSheet from './style';
import PropTypes from 'prop-types';
import TokenItem from './TokenItem';

const TokenList = ({ tokens }) => (
  <Container style={styleSheet.container}>
    {
      tokens && tokens.map(token => <TokenItem key={token.ID} token={token} />)
    }
  </Container>
);

TokenList.propTypes = {
  tokens: PropTypes.array,
};

export default TokenList;

