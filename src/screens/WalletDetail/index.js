import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Toast, Image, View, Text } from '@src/components/core';
import { getBalance , getBalance as getAccountBalance } from '@src/redux/actions/account';
import LoadingContainer from '@src/components/LoadingContainer';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import { accountSeleclor, selectedPrivacySeleclor, tokenSeleclor, sharedSeleclor } from '@src/redux/selectors';
import WalletDetailOptionMenu from '@src/components/HeaderRight/WalletDetailOptionMenu';
import TokenInfo from '@src/components/HeaderRight/TokenInfo';
import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import ROUTE_NAMES from '@src/router/routeNames';
import withdrawIcon from '@src/assets/images/icons/withdraw.png';
import unfollowTokenIcon from '@src/assets/images/icons/unfollowToken.png';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import WalletDetail from './WalletDetail';
import styles from './style';

class WalletDetailContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    const { title, selectedPrivacy, optionMenu } = navigation.state.params || {};
    const infoIconColor = selectedPrivacy?.isToken ? COLORS.black : COLORS.white;
    return {
      title: title,
      headerRight: (
        <View style={styles.headerRight}>
          <TokenInfo selectedPrivacy={selectedPrivacy} iconColor={infoIconColor} />
          <WalletDetailOptionMenu menu={optionMenu} />
        </View>
      )
    };
  }

  componentDidMount() {
    this.setHeaderData();
  }

  componentDidUpdate(prevProps) {
    const { selectedPrivacy: oldSelectedPrivacy } = prevProps;
    const { selectedPrivacy } = this.props;
    if (oldSelectedPrivacy?.tokenId !== selectedPrivacy?.tokenId) {
      this.setHeaderData();
    }
  }

  setHeaderData = () => {
    this.setTitle();
    this.setOptionMenu();
    this.setTokenInfo();
  }

  setTokenInfo = () => {
    const { navigation, selectedPrivacy } = this.props;
    navigation.setParams({
      selectedPrivacy
    });
  }

  setTitle = () => {
    const { navigation, selectedPrivacy } = this.props;
    navigation.setParams({
      title: selectedPrivacy?.name
    });
  }

  setOptionMenu = () => {
    const { navigation, selectedPrivacy } = this.props;
    const options = [];

    if (selectedPrivacy?.isToken) {
      options.push({
        id: 'unfollow',
        icon: <Image source={unfollowTokenIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
        label: 'Remove token',
        desc: 'Any existing balance will reappear when the token is added back',
        handlePress: () => this.handleUnfollowTokenBtn(selectedPrivacy?.tokenId)
      });
    }

    if (selectedPrivacy?.isWithdrawable) {
      options.push({
        id: 'withdraw',
        icon: <Image source={withdrawIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
        label: 'Withdraw',
        desc: 'Withdraw funds to another crypto wallet',
        handlePress: () => navigation.navigate(ROUTE_NAMES.Withdraw)
      });
    }

    navigation.setParams({
      optionMenu: options
    });
  }

  handleUnfollowTokenBtn = async tokenId => {
    try {
      const { account, wallet, setWallet, navigation } = this.props;
      const updatedWallet = await accountService.removeFollowingToken(tokenId, account, wallet);

      // update new wallet to store
      setWallet(updatedWallet);

      Toast.showInfo('Token removed');
      navigation.goBack();
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  }

  onLoadBalance = () => {
    try {
      const { selectedPrivacy, getTokenBalance, getAccountBalance, tokens, account } = this.props;

      if (selectedPrivacy?.isToken) {
        const token = tokens?.find(t => t.id === selectedPrivacy?.tokenId);
        return token && getTokenBalance(token);
      }
      if (selectedPrivacy?.isMainCrypto) {
        return getAccountBalance(account);
      }
    } catch (e) {
      throw e;
    }
  }

  render() {
    const { wallet, account, selectedPrivacy, navigation, isGettingBalanceList, ...otherProps } = this.props;
    if (!selectedPrivacy) {
      return <LoadingContainer />;
    }

    return (
      <WalletDetail
        wallet={wallet}
        account={account}
        selectedPrivacy={selectedPrivacy}
        isGettingBalanceList={isGettingBalanceList}
        navigation={navigation}
        hanldeLoadBalance={this.onLoadBalance}
        {...otherProps}
      />
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state),
  isGettingBalanceList: sharedSeleclor.isGettingBalance(state)
});

const mapDispatch = { getBalance, setWallet, getAccountBalance, getTokenBalance };

WalletDetailContainer.defaultProps = {
  selectedPrivacy: null,
  tokens: []
};

WalletDetailContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
  getTokenBalance: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  tokens: PropTypes.array,
  isGettingBalanceList: PropTypes.array.isRequired
};

export default connect(mapState, mapDispatch)(WalletDetailContainer);