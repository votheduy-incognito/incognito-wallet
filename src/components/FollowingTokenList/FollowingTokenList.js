import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import CryptoItemCard from '../CryptoItemCard';


class FollowingTokenList extends Component {
  render() {
    const { onSelectToken, account, tokens, excludeTokenIds } = this.props;

    return (
      <View>
        {
          !excludeTokenIds.includes(CONSTANT_COMMONS.PRV_TOKEN_ID) && (
            <CryptoItemCard
              tokenId={CONSTANT_COMMONS.PRV_TOKEN_ID}
              onPress={() => onSelectToken(CONSTANT_COMMONS.PRV_TOKEN_ID)}
            />
          )
        }
        {
          tokens?.map(token => !excludeTokenIds.includes(token?.id) && (
            <CryptoItemCard
              key={token?.id}
              onPress={() => onSelectToken(token?.id)}
              tokenId={token?.id}
            />
          ))
        }
      </View>
    );
  }
}

FollowingTokenList.defaultProps = {
  tokens: [],
  excludeTokenIds: []
};

FollowingTokenList.propTypes = {
  onSelectToken: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
  excludeTokenIds: PropTypes.arrayOf(PropTypes.string)
};

export default FollowingTokenList;
