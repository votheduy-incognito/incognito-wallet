import React from 'react';
import PropTypes from 'prop-types';
import {Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from '@src/components/core';
import Transfer from '@screens/Uniswap/components/Transfer';
import depositIcon from '@src/assets/images/icons/deposit_icon.png';
import addLiquidityIcon from '@src/assets/images/icons/add_liquidity_icon.png';
import COLORS from '@src/styles/colors';
import BackButton from '@components/BackButton/index';
import WithdrawSmartContract from '@screens/Uniswap/components/WithdrawSmartContract';
import {airdrop, getUniswapBalance} from '@services/trading';
import dexUtil from '@utils/dex';
import WithdrawalOptions from '@screens/Uniswap/components/WithdrawOptions';
import {Icon} from 'react-native-elements';
import Airdrop from '@screens/Uniswap/components/Airdrop';
import WithdrawMainnet from '@screens/Uniswap/components/WithdrawMainnet';
import routeNames from '@routers/routeNames';
import {ExHandler} from '@services/exception';
import RecentHistory from './components/RecentHistory';
import Swap from './components/Swap';
import {dexStyle, mainStyle} from './style';

class Uniswap extends React.Component {
  state = {
    showWithdraw: false,
    showWithdrawToPDex: false,
    showAirdrop: false,
    showWithdrawMainnet: false,
    tradeParams: {
      inputToken: undefined,
      inputValue: undefined,
      outputToken: undefined,
      outputValue: undefined,
      outputList: [],
      balance: 'Loading',
      prvBalance: 0,
      inputError: undefined,
      showSwapSuccess: false,
      showTradeConfirm: false,
      sending: false,
    },
  };

  async componentDidMount() {
    try {
      const {scAddress} = this.props;
      const balance = await getUniswapBalance(scAddress, {
        address: '0x0000000000000000000000000000000000000000' ,
        decimals: 18,
        pDecimals: 9,
      });

      if (!balance) {
        await airdrop(scAddress);
        this.showPopUp();
      }
    } catch (e) {
      console.debug('AIRDROP', e);
      new ExHandler(e).showErrorToast();
    }
  }

  showPopUp = (name) => {
    // this.setState({ transferAction: name });
    // this.closeWithdrawOptionsPopUp();
    this.setState({ showAirdrop: true });
  };

  closePopUp = () => {
    this.setState({ showAirdrop: false });
  };

  showWithdrawOptionsPopUp = () => {
    this.setState({ showWithdrawMainnet: true });
  };

  closeWithdrawOptionsPopUp = () => {
    this.setState({ showWithdrawMainnet: false });
  };

  showWithdrawToPDexPopUp = () => {
    this.setState({ showWithdrawToPDex: true });
    this.closeWithdrawOptionsPopUp();
  };

  closeWithdrawToPDexPopUp = () => {
    this.setState({ showWithdrawToPDex: false });
  };

  updateTradeParams = (params, cb) => {
    const { tradeParams } = this.state;
    this.setState({ tradeParams : { ...tradeParams, ...params }}, cb);
  };

  getBalance = async (token) => {
    const {scAddress} = this.props;

    const balance = await getUniswapBalance(scAddress, token);
    this.setState({ balance });

    return balance;
  };

  renderModes() {
    const { navigation } = this.props;
    return (
      <View style={dexStyle.header}>
        <BackButton size={20} width={20} />
        <TouchableOpacity style={dexStyle.mode} onPress={() => this.showPopUp('deposit')}>
          <Image source={depositIcon} />
          <Text style={dexStyle.modeText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dexStyle.mode} onPress={this.showWithdrawOptionsPopUp}>
          <Image source={addLiquidityIcon} />
          <Text style={dexStyle.modeText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dexStyle.mode} onPress={() => navigation.navigate(routeNames.UniswapHelp)}>
          <Icon name="help-outline" color={COLORS.primary} />
          <Text style={dexStyle.modeText}>FAQs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={mainStyle.header}>
        <View style={mainStyle.twoColumns}>
          {this.renderModes()}
        </View>
      </View>
    );
  }

  renderTrade() {
    const {
      wallet,
      navigation,
      onAddHistory,
      dexMainAccount,
      tokens,
      isLoading,
      scAddress,
    } = this.props;
    const { tradeParams } = this.state;

    return (
      <Swap
        wallet={wallet}
        navigation={navigation}
        onClosePopUp={this.closePopUp}
        onAddHistory={onAddHistory}
        onUpdateTradeParams={this.updateTradeParams}
        tradeParams={tradeParams}
        dexMainAccount={dexMainAccount}
        tokens={tokens}
        isLoading={isLoading}
        scAddress={scAddress}
        onGetBalance={this.getBalance}
      />
    );
  }

  renderTransfer() {
    const {
      dexMainAccount,
      dexWithdrawAccount,
      wallet,
      accounts,
      tokens,
      onLoadData,
      onSelectPrivacyByTokenID,
      onAddHistory,
      onUpdateHistory,
      onGetHistoryStatus,
      navigation,
      scAddress,
    } = this.props;
    const { tradeParams, transferAction } = this.state;

    const inputToken = tradeParams.inputToken;

    return (
      <Transfer
        dexMainAccount={dexMainAccount}
        dexWithdrawAccount={dexWithdrawAccount}
        wallet={wallet}
        accounts={
          transferAction === 'deposit' ?
            accounts.filter(account => !dexUtil.isDEXWithdrawAccount(account.AccountName)) :
            accounts.filter(account => !dexUtil.isDEXAccount(account.AccountName))
        }
        tokens={tokens}
        action={transferAction}
        onClosePopUp={this.closePopUp}
        inputToken={inputToken}
        onLoadData={onLoadData}
        onSelectPrivacyByTokenID={onSelectPrivacyByTokenID}
        onAddHistory={onAddHistory}
        onUpdateHistory={onUpdateHistory}
        onGetHistoryStatus={onGetHistoryStatus}
        navigation={navigation}
        scAddress={scAddress}
      />
    );
  }

  renderRefreshControl() {
    const { isLoading, onLoadData } = this.props;
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={onLoadData}
        tintColor={COLORS.primary}
        colors={[COLORS.primary]}
      />
    );
  }

  render() {
    const {histories, onGetHistoryStatus, navigation, onAddHistory, wallet, dexMainAccount} = this.props;
    const {
      showWithdraw,
      balance,
      tradeParams,
      showWithdrawToPDex,
      showAirdrop,
      showWithdrawMainnet,
    } = this.state;
    return (
      <View style={mainStyle.wrapper}>
        {this.renderHeader()}
        <View style={[dexStyle.scrollViewContainer]}>
          <ScrollView refreshControl={this.renderRefreshControl()}>
            {this.renderTrade()}
            <RecentHistory
              histories={histories}
              onGetHistoryStatus={onGetHistoryStatus}
              navigation={navigation}
            />
          </ScrollView>
        </View>
        {this.renderTransfer()}
        <WithdrawSmartContract
          visible={showWithdrawToPDex}
          wallet={wallet}
          balance={balance}
          onAddHistory={onAddHistory}
          onClosePopUp={this.closeWithdrawToPDexPopUp}
          token={tradeParams?.inputToken}
          dexMainAccount={dexMainAccount}
        />
        <WithdrawalOptions
          onWithdrawPDEX={this.showWithdrawToPDexPopUp}
          onWithdraw={() => this.showPopUp('withdraw')}
          onClose={this.closeWithdrawOptionsPopUp}
          visible={showWithdraw}
        />
        <Airdrop visible={showAirdrop} onClose={this.closePopUp} />
        <WithdrawMainnet visible={showWithdrawMainnet} onClose={this.closeWithdrawOptionsPopUp} />
      </View>
    );
  }
}

Uniswap.propTypes = {
  accounts: PropTypes.array.isRequired,
  tokens: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  onSelectPrivacyByTokenID: PropTypes.func.isRequired,
  onLoadData: PropTypes.func.isRequired,
  dexMainAccount: PropTypes.object.isRequired,
  dexWithdrawAccount: PropTypes.object.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onGetHistoryStatus: PropTypes.func.isRequired,
  onUpdateHistory: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  scAddress: PropTypes.string.isRequired,
  histories: PropTypes.array.isRequired,
};

export default Uniswap;
