import React from 'react';
import PropTypes from 'prop-types';
import {Container, ScrollView, View, Text, RefreshControl, Button} from '@src/components/core';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import dexUtils from '@utils/dex';
import {COLORS} from '@src/styles';
import FollowingTokenList from '@src/components/FollowingTokenList/FollowingTokenList';
import SettingIcon from '@components/SettingIcon';
import { homeStyle } from './style';

class Wallet extends React.Component {
  render() {
    const {
      account,
      tokens,
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
          <SettingIcon />
          <View style={homeStyle.headerTitleContainer}>
            <Text style={homeStyle.title} numberOfLines={1} ellipsizeMode='middle'>{account.name}</Text>
          </View>
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
            <FollowingTokenList
              account={account}
              tokens={tokens}
              onSelectToken={onSelectToken}
            />
            <View style={homeStyle.addTokenContainer}>
              { !dexUtils.isDEXAccount(account.name) &&
                (
                  <Button
                    title="Issue a privacy coin"
                    onPress={handleCreateToken}
                    style={homeStyle.addTokenBtn}
                  />
                )
              }
              <Text style={homeStyle.followTokenTitle}>Looking for a privacy coin?</Text>
              <TouchableWithoutFeedback onPress={handleAddFollowToken}>
                <View style={homeStyle.followTokenBtn}>
                  <Text style={homeStyle.followTokenText}>Add coins to your list</Text>
                  <Icon
                    containerStyle={[homeStyle.followTokenIcon]}
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

Wallet.defaultProps = {
  account: null,
  tokens: [],
  isReloading: false
};

Wallet.propTypes = {
  account: PropTypes.object,
  tokens: PropTypes.array,
  onSelectToken: PropTypes.func.isRequired,
  handleAddFollowToken: PropTypes.func.isRequired,
  handleCreateToken: PropTypes.func.isRequired,
  handleSetting: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  isReloading: PropTypes.bool,
};

export default Wallet;
