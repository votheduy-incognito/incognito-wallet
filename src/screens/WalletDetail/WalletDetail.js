import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View, ActivityIndicator, Image, TouchableScale} from '@src/components/core';
import Card from '@components/Card';
import ROUTE_NAMES from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import HistoryToken from '@src/components/HistoryToken';
import MainCryptoHistory from '@src/components/MainCryptoHistory';
import formatUtil from '@src/utils/format';
import sendIcon from '@src/assets/images/icons/ic_send_btn.png';
import depositIcon from '@src/assets/images/icons/ic_shield_btn.png';
import receiveIcon from '@src/assets/images/icons/ic_receive_btn.png';
import { ExHandler } from '@src/services/exception';
import dexUtils from '@src/utils/dex';
import styles from './style';

class WalletDetail extends Component {
  constructor() {
    super();
  }

  handleLoadBalance = async () => {
    try {
      const { hanldeLoadBalance } = this.props;
      return await hanldeLoadBalance();
    } catch (e) {
      new ExHandler(e, 'Pull down to reload you balance.').showErrorToast();
    }
  };

  handleDepositBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.Shield);
  };

  handleSendBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.SendCrypto);
  };

  handleReceiveBtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.ReceiveCoin);
  };

  renderActionButton = ({ label, icon, onPress, isDeposable }) => (
    <TouchableScale onPress={onPress} style={isDeposable ? styles.btn2 : styles.btn}>
      <Image source={icon} />
      <Text>{label}</Text>
    </TouchableScale>
  );

  renderText = (text, { style, ...props } = {}) => {
    const { theme } = this.props;
    return <Text numberOfLines={1} ellipsizeMode='tail' {...props} style={[style, { color: theme?.textColor }]}>{text}</Text>;
  };

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
          <Card style={styles.btnContainer}>
            {!dexUtils.isDEXMainAccount(account.name) && this.renderActionButton({ label: 'Send', icon: sendIcon, onPress: this.handleSendBtn, isDeposable })}
            {!dexUtils.isDEXWithdrawAccount(account.name) && this.renderActionButton({ label: 'Receive', icon: receiveIcon, onPress: this.handleReceiveBtn, isDeposable })}
            {
              isDeposable && this.renderActionButton({ label: 'Shield', icon: depositIcon, onPress: this.handleDepositBtn, isDeposable })
            }
          </Card>
        </View>
        <View style={styles.container}>
          {
            selectedPrivacy?.isToken && (
              <View style={styles.historyContainer}>
                <HistoryToken navigation={navigation} onLoad={this.handleLoadBalance} />
              </View>
            )
          }
          {
            selectedPrivacy?.isMainCrypto && (
              <View style={styles.historyContainer}>
                <MainCryptoHistory navigation={navigation} onLoad={this.handleLoadBalance} />
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
