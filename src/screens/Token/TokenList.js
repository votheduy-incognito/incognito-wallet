/**
 * @augments {Component<{  tokens:array,  navigation:object,  accountWallet:object,  onRemoveFollowToken:Function>}
 */
import { Container } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import styleSheet from './style';
import TokenItem from './TokenItem';

const TokenList = ({
  tokens,
  navigation,
  accountWallet,
  onRemoveFollowToken
}) => (
  <Container style={styleSheet.container}>
    {tokens &&
      tokens.map(token => (
        <TokenItem
          key={token.ID}
          token={token}
          navigation={navigation}
          accountWallet={accountWallet}
          onRemoveFollowToken={onRemoveFollowToken}
        />
      ))}
  </Container>
);
TokenList.defaultProps = {
  tokens: undefined,
  navigation: undefined,
  accountWallet: undefined,
  onRemoveFollowToken: undefined
};
TokenList.propTypes = {
  tokens: PropTypes.objectOf(PropTypes.array),
  navigation: PropTypes.objectOf(PropTypes.object),
  accountWallet: PropTypes.objectOf(PropTypes.object),
  onRemoveFollowToken: PropTypes.func
};

export default TokenList;
