import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import LoadingContainer from '@src/components/LoadingContainer';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import { accountSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import SendReceiveGroup from '@src/components/HeaderRight/SendReceiveGroup';
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
    const { wallet, account, selectedPrivacy, navigation, ...otherProps } = this.props;

    if (!selectedPrivacy) {
      return <LoadingContainer />;
    }

    return (
      <WalletDetail
        wallet={wallet}
        account={account}
        selectedPrivacy={selectedPrivacy}
        navigation={navigation}
        handleRemoveFollowToken={this.onRemoveFollowToken}
        {...otherProps}
      />
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state)
});

const mapDispatch = { getBalance, setWallet };

WalletDetailContainer.defaultProps = {
  selectedPrivacy: null
};

WalletDetailContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(WalletDetailContainer);