import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, View, Text } from '@src/components/core';
import CryptoItemCard from '@src/components/CryptoItemCard';
import { homeStyle } from './style';
import tokenData from '@src/constants/tokenData';
import TouchableOpacity from '@src/components/core/TouchableOpacity/Component';


class Home extends React.Component {
  render() {
    const { account, tokens, isGettingBalanceList, onSelectToken } = this.props;

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <CryptoItemCard
            style={homeStyle.cryptoItem}
            tokenSymbol={tokenData.SYMBOL.PRV}
            amount={account?.amount}
            isGettingBalance={isGettingBalanceList?.includes(account?.name)}
            onPress={onSelectToken}
          />
          {
            tokens?.map(token => (
              <CryptoItemCard
                style={homeStyle.cryptoItem}
                key={token.symbol}
                tokenSymbol={token.symbol}
                amount={token.amount}
                isGettingBalance={isGettingBalanceList?.includes(token.name)}
                onPress={onSelectToken}
              />
            ))
          }
          <View style={homeStyle.addTokenContainer}>
            <Text style={homeStyle.addTokenLabel}>Don’t see your token?</Text>
            <TouchableOpacity>
              <Text style={homeStyle.addTokenBtn}>Add token</Text>
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
};

Home.propTypes = {
  isGettingBalanceList: PropTypes.array,
  account: PropTypes.object,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired
};

export default Home;
