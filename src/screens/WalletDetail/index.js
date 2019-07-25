import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance , getBalance as getAccountBalance } from '@src/redux/actions/account';
import LoadingContainer from '@src/components/LoadingContainer';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import { accountSeleclor, selectedPrivacySeleclor, tokenSeleclor, sharedSeleclor } from '@src/redux/selectors';
import SendReceiveGroup from '@src/components/HeaderRight/SendReceiveGroup';

import { getBalance as getTokenBalance } from '@src/redux/actions/token';
import WalletDetail from './WalletDetail';

class WalletDetailContainer extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params?.title,
      headerRight: <SendReceiveGroup />
    };
  }

  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate(prevProps) {
    const { selectedPrivacy: oldSelectedPrivacy } = prevProps;
    const { selectedPrivacy } = this.props;
    if (oldSelectedPrivacy?.symbol !== selectedPrivacy?.symbol) {
      this.setTitle();
    }
  }

  setTitle = () => {
    const { navigation, selectedPrivacy } = this.props;
    navigation.setParams({
      title: selectedPrivacy?.name
    });
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

  onRemoveFollowToken = async tokenId => {
    try {
      const { account, wallet, setWallet } = this.props;
      const updatedWallet = await accountService.removeFollowingToken(tokenId, account, wallet);

      // update new wallet to store
      setWallet(updatedWallet);
      return true;
    } catch (e) {
      throw e;
    }
  };

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
        handleRemoveFollowToken={this.onRemoveFollowToken}
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