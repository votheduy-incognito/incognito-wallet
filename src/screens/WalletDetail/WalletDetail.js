import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View, ActivityIndicator, Image, TouchableScale} from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import HistoryToken from '@src/components/HistoryToken';
import MainCryptoHistory from '@src/components/MainCryptoHistory';
import formatUtil from '@src/utils/format';
import sendIcon from '@src/assets/images/icons/send.png';
import depositIcon from '@src/assets/images/icons/deposit_pig.png';
import receiveIcon from '@src/assets/images/icons/qrCode.png';
import { ExHandler } from '@src/services/exception';
import dexUtils from '@src/utils/dex';
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
    } catch (e) {
      new ExHandler(e, 'Pull down to reload you balance.').showErrorToast();
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
    <TouchableScale onPress={onPress} style={styles.actionButton}>
      <View style={styles.buttonImg}>
        <Image source={icon} style={styles.actionButtonIcon} />
      </View>
      {this.renderText(label, { style: styles.buttonText })}
    </TouchableScale>
  );

  renderText = (text, { style, ...props } = {}) => {
    const { theme } = this.props;
    return <Text numberOfLines={1} ellipsizeMode='tail' {...props} style={[style, { color: theme?.textColor }]}>{text}</Text>;
  }

  render() {
    const { selectedPrivacy, navigation, isGettingBalanceList, theme, account } = this.props;
    const { isDeposable } = selectedPrivacy;
    return (
      <View style={styles.container}>
        <View style={[styles.boxHeader, { backgroundColor: theme?.backgroundColor }]}>
          <View style={styles.boxBalance}>
            {
              isGettingBalanceList?.includes(selectedPrivacy.tokenId)
                ? <ActivityIndicator color={COLORS.white} />
                : (
                  <View style={styles.balanceContainer}>
                    {this.renderText(formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy.pDecimals), { style: styles.balance })}
                    {this.renderText(selectedPrivacy.symbol, { style: styles.balanceSymbol })}
                  </View>
                )
            }
          </View>
          <View style={styles.buttonRow}>
            {!dexUtils.isDEXMainAccount(account.name) && this.renderActionButton({ label: 'Send', icon: sendIcon, onPress: this.handleSendBtn })}
            {!dexUtils.isDEXWithdrawAccount(account.name) && this.renderActionButton({ label: 'Receive', icon: receiveIcon, onPress: this.handleReceiveBtn })}
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
  isGettingBalanceList: PropTypes.array.isRequired,
  theme: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
};

export default WalletDetail;
