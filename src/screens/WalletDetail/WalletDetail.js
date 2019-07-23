import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Button, View, Toast } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
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

  handleDepositBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.Deposit);
  }

  handleWithdrawBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.Withdraw);
  }

  render() { 
    const { selectedPrivacy, navigation } = this.props;  
    const additionalData = selectedPrivacy?.additionalData;

    return (
      <View style={styles.container}> 
        <View style={styles.boxHeader}> 
          <View style={styles.boxBalance}>
            <Text style={styles.balance}>
              {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy.symbol)} {selectedPrivacy.symbol}
            </Text>
          </View>
        </View>
        <Container style={styles.container}>
          <View style={styles.buttonRow}>
            {
              additionalData?.isDeposable && <Button style={styles.btnStyle} title='Deposit' onPress={this.handleDepositBtn} />
            }
            {
              additionalData?.isWithdrawable && <Button style={[styles.btnStyle, styles.withdrawBtn]} title='Withdraw' onPress={this.handleWithdrawBtn} />
            }
            {
              selectedPrivacy?.isToken && !additionalData?.isNotAllowUnfollow  && <Button style={[styles.btnStyle]} title='Unfollow' onPress={this.handleUnfollowTokenBtn} />
            }
          </View>
          {
            selectedPrivacy?.isToken && (
              <View style={styles.historyContainer}>
                <HistoryToken navigation={navigation} />
              </View>
            )
          }
          {
            selectedPrivacy?.isMainCrypto && (
              <View style={styles.historyContainer}>
                <MainCryptoHistory navigation={navigation} />
              </View>
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
};

export default WalletDetail;