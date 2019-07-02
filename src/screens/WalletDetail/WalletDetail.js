import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Button, View, Toast } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import OptionMenu from '@src/components/OptionMenu';
import MdCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FSIcons from 'react-native-vector-icons/FontAwesome5';
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

  getMenuData = () => {
    const { selectedPrivacy } = this.props;
    const additionalData = selectedPrivacy?.additionalData;
    const data = [];

    additionalData?.isWithdrawable && data.push({
      id: 'withdraw',
      label: 'Withdraw',
      handlePress: this.handleWithdrawBtn,
      icon: <MdCIcons name='cash-refund' size={20} />
    });

    additionalData?.isDeposable && data.push({
      id: 'deposit',
      label: 'Deposit',
      handlePress: this.handleDepositBtn,
      icon: <FSIcons name='hand-holding-usd' size={20} />
    });

    selectedPrivacy?.isToken && !additionalData?.isNotAllowUnfollow && data.push({
      id: 'unfollow_token',
      label: 'Unfollow token',
      handlePress: this.handleUnfollowTokenBtn,
      icon: <MdCIcons name='playlist-remove' size={20} />
    });

    return data;
  }

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

  handleSendbtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.SendCrypto);
  }

  handleReceivebtn = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.ReceiveCrypto);
  }
  

  render() { 
    const { selectedPrivacy, navigation } = this.props;  
    const menuData = this.getMenuData();

    return (
      <Container style={styles.container}> 
        <View style={styles.boxHeader}> 
          {
            menuData.length > 0 && <OptionMenu iconProps={{color: '#fff'}} data={menuData} /> 
          }

          <View style={styles.boxBalance}>
            <Text style={styles.balance}>
              {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy.symbol)} {selectedPrivacy.symbol}
            </Text>
            {/* <Text style={styles.getFree}>Get free coin</Text> */}

            <View style={styles.boxButton}>
              <Button title='Receive' onPress={this.handleReceivebtn} style={styles.btnStyle} />
              <Button title='Send' onPress={this.handleSendbtn} style={styles.btnStyle} />
            </View>

          </View>

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
    );
  }
}

WalletDetail.propTypes = {
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  handleRemoveFollowToken: PropTypes.func.isRequired,
};

export default WalletDetail;