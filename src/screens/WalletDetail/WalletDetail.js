import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Button, View, Toast, ActivityIndicator, TouchableOpacity } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import HistoryToken from '@src/components/HistoryToken';
import MainCryptoHistory from '@src/components/MainCryptoHistory';
import formatUtil from '@src/utils/format';
import styles from './style';

class WalletDetail extends Component {
  constructor() {
    super();
  }

  goHome = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  handleUnfollowTokenBtn = async () => {
    try {
      const { handleRemoveFollowToken, selectedPrivacy, navigation } = this.props;
      await handleRemoveFollowToken(selectedPrivacy?.tokenId);

      Toast.showInfo('Unfollowed successfully');
      navigation.goBack();
    } catch {
      Toast.showError('Can not unfollow this token right now, please try later.');
    }
  }

  hanldeLoadBalance = async () => {
    try {
      const { hanldeLoadBalance } = this.props;
      return await hanldeLoadBalance();
    } catch {
      Toast.showWarning('Can not reload balance right now, please try again');
    }
  }

  handleDepositBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.Deposit);
  }

  handleWithdrawBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.Withdraw);
  }

  render() { 
    const { selectedPrivacy, navigation, isGettingBalanceList } = this.props;  
    const { isDeposable, isWithdrawable } = selectedPrivacy;

    return (
      <View style={styles.container}> 
        <View style={styles.boxHeader}> 
          <View style={styles.boxBalance}>
            {
              isGettingBalanceList?.includes(selectedPrivacy.symbol)
                ? <ActivityIndicator color={COLORS.white} />
                : (
                  <Text style={styles.balance}>
                    {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy.decimals)} {selectedPrivacy.symbol}
                  </Text>
                )
            }
          </View>
        </View>
        <Container style={styles.container}>
          <View style={styles.buttonRow}>
            {
              isDeposable && <Button style={styles.btnStyle} title='Deposit' onPress={this.handleDepositBtn} />
            }
            {
              isWithdrawable && <Button style={[styles.btnStyle, styles.withdrawBtn]} title='Withdraw' onPress={this.handleWithdrawBtn} />
            }
          </View>
          {
            selectedPrivacy?.isToken && (
              <View style={styles.historyContainer}>
                <HistoryToken navigation={navigation} onLoad={this.hanldeLoadBalance} />
              </View>
            )
          }
          {
            selectedPrivacy?.isMainCrypto && (
              <View style={styles.historyContainer}>
                <MainCryptoHistory navigation={navigation} onLoad={this.hanldeLoadBalance} />
              </View>
            )
          }
          {
            selectedPrivacy?.isToken && (
              <TouchableOpacity
                style={[styles.unfollowBtn]}
                onPress={this.handleUnfollowTokenBtn}
              >
                <Text style={styles.unfollowText}>Unfollow token</Text>
              </TouchableOpacity>
            )
          }
        </Container>
      </View>          
    );
  }
}

WalletDetail.propTypes = {
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  handleRemoveFollowToken: PropTypes.func.isRequired,
  hanldeLoadBalance: PropTypes.func.isRequired,
  isGettingBalanceList: PropTypes.array.isRequired
};

export default WalletDetail;