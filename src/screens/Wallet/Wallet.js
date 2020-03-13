import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, RefreshControl, Button, TouchableOpacity, Image} from '@src/components/core';
import dexUtils from '@utils/dex';
import FollowingTokenList from '@src/components/FollowingTokenList/FollowingTokenList';
import iconAdd from '@src/assets/images/icons/ic_add_round.png';
import {homeStyle} from './style';

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
            <TouchableOpacity onPress={handleAddFollowToken} style={homeStyle.followTokenBtn}>
              <Image source={iconAdd} style={homeStyle.followTokenIcon} />
              <Text style={homeStyle.followTokenText}>Add a coin your list</Text>
            </TouchableOpacity>
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
