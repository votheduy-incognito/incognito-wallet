import React from 'react';
import { Container } from '@src/components/core';
import styleSheet from './style';
import PropTypes from 'prop-types';
import TokenItem from './TokenItem';

const TokenList = ({ tokens, navigation, accountWallet }) => (
  <Container style={styleSheet.container}>
    {
      tokens && tokens.map(token => <TokenItem key={token.ID} token={token} navigation={navigation} accountWallet={accountWallet} />)
    }
  </Container>
);

TokenList.propTypes = {
  tokens: PropTypes.array,
  navigation: PropTypes.object
};

export default TokenList;

