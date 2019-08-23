import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, View, Text, RefreshControl } from '@src/components/core';
import CryptoItemCard from '@src/components/CryptoItemCard';
import tokenData from '@src/constants/tokenData';
import TouchableOpacity from '@src/components/core/TouchableOpacity/Component';
import { CONSTANT_COMMONS } from '@src/constants';
import { homeStyle } from './style';

class Home extends React.Component {
  render() {
    const { account, tokens, isGettingBalanceList, onSelectToken, handleAddFollowToken, reload, isReloading } = this.props;

    return (
      <ScrollView
        style={homeStyle.container}
        refreshControl={(
          <RefreshControl
            refreshing={isReloading}
            onRefresh={reload}
          />
        )}
      >
        <View style={homeStyle.bgStyle} />
        <Container style={homeStyle.mainContainer}>
          <CryptoItemCard
            style={homeStyle.cryptoItem}
            token={{
              symbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
              amount: account?.value,
              name: 'Incognito',
              metaData: {
                pSymbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
                pDecimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
                decimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
              }
            }}
            isGettingBalance={isGettingBalanceList?.includes(account?.name)}
            onPress={onSelectToken}
          />
          {
            tokens?.map(token => (
              <CryptoItemCard
                style={homeStyle.cryptoItem}
                key={token.symbol}
                token={token}
                isGettingBalance={isGettingBalanceList?.includes(token.name)}
                onPress={onSelectToken}
              />
            ))
          }
          <View style={homeStyle.addTokenContainer}>
            <TouchableOpacity onPress={handleAddFollowToken}>
              <Text style={homeStyle.addTokenBtn}>Add a token</Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScrollView>
    );
  }
}

Home.defaultProps = {
  isGettingBalanceList: null,
  account: null,
  tokens: [],
  isReloading: false
};

Home.propTypes = {
  isGettingBalanceList: PropTypes.array,
  account: PropTypes.object,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
};

export default Home;
