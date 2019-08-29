import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Button, View, Toast, ActivityIndicator, Image, TouchableOpacity } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import HistoryToken from '@src/components/HistoryToken';
import MainCryptoHistory from '@src/components/MainCryptoHistory';
import formatUtil from '@src/utils/format';
import sendIcon from '@src/assets/images/icons/send.png';
import depositIcon from '@src/assets/images/icons/deposit_pig.png';
import receiveIcon from '@src/assets/images/icons/qrCode.png';
import styles from './style';

class WalletDetail extends Component {
  constructor() {
    super();
  }

  goHome = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  hanldeLoadBalance = async () => {
    try {
      const { hanldeLoadBalance } = this.props;
      return await hanldeLoadBalance();
    } catch {
      Toast.showWarning('Something went wrong. Please refresh the screen.');
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

  handleSendBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.SendCrypto);
  }

  handleReceiveBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.ReceiveCrypto);
  }

  renderActionButton = ({ label, icon, onPress }) => (
    <Button style={styles.actionButton} onPress={onPress}>
      <Image source={icon} style={styles.actionButtonIcon} />
      <Text>{label}</Text>
    </Button>
  );

  render() { 
    const { selectedPrivacy, navigation, isGettingBalanceList } = this.props;  
    const { isDeposable } = selectedPrivacy;

    return (
      <View style={styles.container}> 
        <View style={styles.boxHeader}> 
          <View style={styles.boxBalance}>
            {
              isGettingBalanceList?.includes(selectedPrivacy.symbol)
                ? <ActivityIndicator color={COLORS.white} />
                : (
                  <Text style={styles.balance}>
                    {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy.pDecimals)} {selectedPrivacy.symbol}
                  </Text>
                )
            }
          </View>
          <View style={styles.buttonRow}>
            {this.renderActionButton({ label: 'Send', icon: sendIcon, onPress: this.handleSendBtn })}
            {this.renderActionButton({ label: 'Receive', icon: receiveIcon, onPress: this.handleReceiveBtn })}
            {
              isDeposable && this.renderActionButton({ label: 'Deposit', icon: depositIcon, onPress: this.handleDepositBtn })
            }
          </View>
        </View>
        <View style={styles.container}>
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
        </View>
      </View>          
    );
  }
}

WalletDetail.propTypes = {
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  hanldeLoadBalance: PropTypes.func.isRequired,
  isGettingBalanceList: PropTypes.array.isRequired
};

export default WalletDetail;