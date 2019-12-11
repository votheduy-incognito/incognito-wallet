import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import CryptoItemCard from '../CryptoItemCard';


class FollowingTokenList extends Component {
  render() {
    const { accountGettingBalanceList, tokenGettingBalanceList, onSelectToken, account, tokens, excludeTokenIds } = this.props;

    return (
      <Container>
        {
          !excludeTokenIds.includes(CONSTANT_COMMONS.PRV_TOKEN_ID) && (
            <CryptoItemCard
              token={{
                symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
                id: CONSTANT_COMMONS.PRV_TOKEN_ID,
                amount: account?.value ?? null,
                name: 'Incognito',
                fullName: 'Privacy',
                metaData: {
                  pSymbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV,
                  pDecimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
                  decimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
                }
              }}
              isGettingBalance={accountGettingBalanceList?.includes(account?.name)}
              onPress={() => onSelectToken(CONSTANT_COMMONS.PRV_TOKEN_ID)}
            />
          )
        }
        {
          tokens?.map(token => !excludeTokenIds.includes(token?.id) && (
            <CryptoItemCard
              key={token?.id}
              onPress={() => onSelectToken(token?.id)}
              token={token}
              isGettingBalance={tokenGettingBalanceList?.includes(token?.id)}
            />
          ))
        }
      </Container>
    );
  }
}

FollowingTokenList.defaultProps = {
  accountGettingBalanceList: [],
  tokenGettingBalanceList: [],
  tokens: [],
  excludeTokenIds: []
};

FollowingTokenList.propTypes = {
  accountGettingBalanceList: PropTypes.arrayOf(PropTypes.string),
  tokenGettingBalanceList: PropTypes.arrayOf(PropTypes.string),
  onSelectToken: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  tokens: PropTypes.arrayOf(PropTypes.object),
  excludeTokenIds: PropTypes.arrayOf(PropTypes.string)
};

export default FollowingTokenList;
