import React from 'react';
import PropTypes from 'prop-types';
import {Container, ScrollView, View, Text, RefreshControl, Button, Image} from '@src/components/core';
import CryptoItemCard from '@src/components/CryptoItemCard';
import tokenData from '@src/constants/tokenData';
import { CONSTANT_COMMONS } from '@src/constants';
import setting from '@src/assets/images/setting_white.png';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import {COLORS} from '@src/styles';
import { homeStyle } from './style';

class Home extends React.Component {
  render() {
    const {
      account,
      tokens,
      accountGettingBalanceList,
      tokenGettingBalanceList,
      onSelectToken,
      handleAddFollowToken,
      handleCreateToken,
      handleSetting,
      reload,
      isReloading
    } = this.props;

    return (
      <View style={homeStyle.wrapper}>
        <View style={homeStyle.header}>
          <TouchableWithoutFeedback onPress={handleSetting}>
            <Image source={setting} style={homeStyle.setting} />
          </TouchableWithoutFeedback>
          <Text style={homeStyle.title}>{account.name}</Text>
          {/* Use below empty view to push the title to middle */}
          <View style={homeStyle.setting} />
        </View>
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
                amount: account?.value ?? null,
                name: 'Incognito',
                metaData: {
                  pSymbol: tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY,
                  pDecimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
                  decimals: CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY
                }
              }}
              isGettingBalance={accountGettingBalanceList?.includes(account?.name)}
              onPress={onSelectToken}
            />
            {
            tokens?.map(token => (
              <CryptoItemCard
                style={homeStyle.cryptoItem}
                key={token.symbol}
                token={token}
                isGettingBalance={tokenGettingBalanceList?.includes(token?.symbol)}
                onPress={onSelectToken}
              />
            ))
            }
            <View style={homeStyle.addTokenContainer}>
              <Button
                title="Issue your own token"
                onPress={handleCreateToken}
                style={homeStyle.addTokenBtn}
              />
              <Text style={homeStyle.followTokenTitle}>Looking for available tokens?</Text>
              <TouchableWithoutFeedback onPress={handleAddFollowToken}>
                <View style={homeStyle.followTokenBtn}>
                  <Text style={homeStyle.followTokenText}>Follow a token</Text>
                  <Icon
                    containerStyle={[homeStyle.followTokenText, homeStyle.followTokenIcon]}
                    name="chevron-right"
                    color={COLORS.primary}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Container>
        </ScrollView>
      </View>
    );
  }
}

Home.defaultProps = {
  tokenGettingBalanceList: [],
  accountGettingBalanceList: [],
  account: null,
  tokens: [],
  isReloading: false
};

Home.propTypes = {
  tokenGettingBalanceList: PropTypes.array,
  accountGettingBalanceList: PropTypes.array,
  account: PropTypes.object,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  handleCreateToken: PropTypes.func.isRequired,
  handleSetting: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
};

export default Home;
