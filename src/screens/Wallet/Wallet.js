import React from 'react';
import PropTypes from 'prop-types';
import {Container, ScrollView, View, Text, RefreshControl, Button} from '@src/components/core';
import { TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import dexUtils from '@utils/dex';
import {COLORS} from '@src/styles';
import FollowingTokenList from '@src/components/FollowingTokenList/FollowingTokenList';
import SettingIcon from '@components/SettingIcon';
import AccountSelect from '@screens/Wallet/AccountSelect';
import { homeStyle } from './style';

class Wallet extends React.Component {
  render() {
    const {
      account,
      tokens,
      onSelectToken,
      handleAddFollowToken,
      handleCreateToken,
      reload,
      isReloading
    } = this.props;

    return (
      <View style={homeStyle.wrapper}>
        <ScrollView
          style={homeStyle.container}
          refreshControl={(
            <RefreshControl
              refreshing={isReloading}
              onRefresh={reload}
            />
          )}
        >
          <View style={homeStyle.mainContainer}>
            <FollowingTokenList
              account={account}
              tokens={tokens}
              onSelectToken={onSelectToken}
            />
            <View style={homeStyle.addTokenContainer}>
              { !dexUtils.isDEXAccount(account.name) &&
                (
                  <Button
                    title="Issue your own privacy coin"
                    onPress={handleCreateToken}
                    style={homeStyle.addTokenBtn}
                  />
                )
              }
              <Text style={homeStyle.followTokenTitle}>Looking for a privacy coin?</Text>
              <TouchableWithoutFeedback onPress={handleAddFollowToken}>
                <View style={homeStyle.followTokenBtn}>
                  <Text style={homeStyle.followTokenText}>Search existing coins</Text>
                  <Icon
                    containerStyle={[homeStyle.followTokenIcon]}
                    name="chevron-right"
                    color={COLORS.primary}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
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
