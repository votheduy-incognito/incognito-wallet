import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Text, ScrollView, RefreshControl, TouchableOpacity} from '@src/components/core';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import withdrawBlack from '@assets/images/icons/withdraw_black.png';
import DepositGuide from '@screens/Dex/components/DepositGuide';
import Transfer from '@screens/Dex/components/Transfer';
import RecentHistory from '@screens/Dex/components/RecentHistory';
import depositIcon from '@src/assets/images/icons/deposit_icon.png';
import tradeIcon from '@src/assets/images/icons/trade_icon.png';
import addLiquidityIcon from '@src/assets/images/icons/add_liquidity_icon.png';
import removeLiquidityIcon from '@src/assets/images/icons/remove_liquidity_icon.png';
import dexUtils from '@utils/dex';
import AddPool from './components/AddPool';
import RemovePool from './components/RemovePool';
import Swap from './components/Swap';
import { dexStyle, mainStyle } from './style';

const MODES = {
  SWAP: 'trade',
  ADD: 'add',
  REMOVE: 'remove',
};

class Dex extends React.Component {
  state = {
    mode: MODES.SWAP,
    showDepositGuide: false,
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
    addLiquidityParams: {
      adding: false,
      inputToken: undefined,
      inputValue: undefined,
      inputFee: 0,
      pTokens: [],
      inputList: [],
      outputList: [],
      outputToken: undefined,
      outputValue: undefined,
      outputFee: 0,
      shareBalance: undefined,
      prvBalance: 0,
      inputError: undefined,
      showSuccess: false,
    },
    removeLiquidityParams: {
      pair: null,
      userPairs: [],
      topText: 0,
      bottomText: 0,
      prvBalance: 0,
      fee: undefined,
      showSuccess: false,
    }
  };

  menu = [
    {
      id: 'remove',
      icon: <Image source={removeLiquidityIcon} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Remove liquidity',
      desc: 'Remove your liquidity from the pool',
      handlePress: () => this.changeMode(MODES.REMOVE),
    },
    {
      id: 'withdraw',
      icon: <Image source={withdrawBlack} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Withdraw',
      desc: 'Withdraw funds from your pDEX account to \nanother account',
      handlePress: () => this.showPopUp('withdraw'),
    }
  ];

  componentDidMount() {
    const { navigation } = this.props;
    this.listener = navigation.addListener('didFocus', () => {
      const { navigation } = this.props;
      console.debug('DEX', navigation);
      if (navigation.state?.params?.mode) {
        const mode = navigation.state.params.mode;
        this.setState({ mode });
      }
    });
  }

  componentWillUnmount() {
    if (this.listener) {
      this.listener.remove();
    }
  }

  changeMode(mode) {
    console.debug('CHANGE MODE', mode);
    this.setState({ mode });
  }

  showPopUp = (name) => {
    this.setState({ transferAction: name });
  };

  closePopUp = () => {
    this.setState({ transferAction: null });
  };

  showDepositGuide = () => {
    this.setState({ showDepositGuide: true });
  };

  closeDepositGuide = () => {
    this.setState({ showDepositGuide: false });
    this.showPopUp('deposit');
  };

  updateTradeParams = (params, cb) => {
    const { tradeParams } = this.state;
    this.setState({ tradeParams : { ...tradeParams, ...params }}, cb);
  };

  updateAddLiquidityParams = (params, cb) => {
    const { addLiquidityParams } = this.state;
    this.setState({ addLiquidityParams : { ...addLiquidityParams, ...params }}, cb);
  };

  updateRemoveLiquidityParams = (params, cb) => {
    const { removeLiquidityParams } = this.state;
    this.setState({ removeLiquidityParams : { ...removeLiquidityParams, ...params }}, cb);
  };

  renderModes() {
    const { mode } = this.state;
    return (
      <View style={dexStyle.header}>
        <TouchableOpacity style={dexStyle.mode} onPress={() => this.showPopUp('deposit')}>
          <Image source={depositIcon} />
          <Text style={dexStyle.modeText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dexStyle.mode} onPress={() => this.changeMode(MODES.SWAP)}>
          <Image source={tradeIcon} />
          <Text style={[dexStyle.modeText, mode === MODES.SWAP && dexStyle.active]}>Trade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dexStyle.mode} onPress={() => this.changeMode(MODES.ADD)}>
          <Image source={addLiquidityIcon} />
          <Text style={[dexStyle.modeText, mode === MODES.ADD && dexStyle.active]}>Add liquidity</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={mainStyle.header}>
        <View style={mainStyle.twoColumns}>
          {this.renderModes()}
          <View style={dexStyle.options}>
            <OptionMenu data={this.menu} style={mainStyle.textRight} />
          </View>
        </View>
      </View>
    );
  }

  renderTrade() {
    const {
      wallet,
      navigation,
      histories,
      onAddHistory,
      onUpdateHistory,
      onGetHistoryStatus,
      onGetHistories,
      dexMainAccount,
      tokens,
      pairTokens,
      pairs,
      isLoading,
    } = this.props;
    const { tradeParams } = this.state;
    return (
      <Swap
        wallet={wallet}
        navigation={navigation}
        onClosePopUp={this.closePopUp}
        onShowDepositGuide={this.showDepositGuide}
        histories={histories}
        onAddHistory={onAddHistory}
        onUpdateHistory={onUpdateHistory}
        onGetHistoryStatus={onGetHistoryStatus}
        onGetHistories={onGetHistories}
        onUpdateTradeParams={this.updateTradeParams}
        tradeParams={tradeParams}
        dexMainAccount={dexMainAccount}
        tokens={tokens}
        pairTokens={pairTokens}
        pairs={pairs}
        isLoading={isLoading}
      />
    );
  }

  renderPool() {
    const {
      wallet,
      histories,
      onAddHistory,
      onUpdateHistory,
      onGetHistoryStatus,
      tokens,
      pairs,
      dexMainAccount,
      accounts,
      pairTokens,
      shares,
      isLoading,
    } = this.props;
    const { addLiquidityParams, mode, removeLiquidityParams } = this.state;

    if (mode === MODES.ADD) {
      return (
        <AddPool
          account={dexMainAccount}
          wallet={wallet}
          histories={histories}
          onAddHistory={onAddHistory}
          onUpdateHistory={onUpdateHistory}
          onGetHistoryStatus={onGetHistoryStatus}
          onUpdateParams={this.updateAddLiquidityParams}
          params={addLiquidityParams}
          tokens={tokens}
          pairTokens={pairTokens}
          pairs={pairs}
          isLoading={isLoading}
        />
      );
    }

    return (
      <RemovePool
        accounts={accounts}
        wallet={wallet}
        histories={histories}
        onAddHistory={onAddHistory}
        onUpdateHistory={onUpdateHistory}
        onGetHistoryStatus={onGetHistoryStatus}
        onUpdateParams={this.updateRemoveLiquidityParams}
        params={removeLiquidityParams}
        tokens={tokens}
        pairTokens={pairTokens}
        pairs={pairs}
        shares={shares}
        isLoading={isLoading}
      />
    );
  }

  renderMode() {
    const { mode } = this.state;
    if (mode === MODES.SWAP) {
      return this.renderTrade();
    }

    return this.renderPool();
  }

  renderTransfer() {
    const {
      dexMainAccount,
      dexWithdrawAccount,
      wallet,
      accounts,
      tokens,
      pairTokens,
      onAddHistory,
      onUpdateHistory,
      onLoadData,
      onSelectPrivacyByTokenID,
    } = this.props;
    const { mode, addLiquidityParams, tradeParams, transferAction } = this.state;

    let inputToken;
    let transferTokens = tokens;

    if (mode === MODES.SWAP) {
      inputToken = tradeParams.inputToken;
      transferTokens = pairTokens;
    } else if (mode === MODES.ADD) {
      inputToken = addLiquidityParams.inputToken;
    }

    return (
      <Transfer
        dexMainAccount={dexMainAccount}
        dexWithdrawAccount={dexWithdrawAccount}
        wallet={wallet}
        accounts={(accounts || []).filter(item => !dexUtils.isDEXAccount(item.AccountName))}
        tokens={transferTokens}
        action={transferAction}
        onClosePopUp={this.closePopUp}
        inputToken={inputToken}
        onLoadData={onLoadData}
        onAddHistory={onAddHistory}
        onUpdateHistory={onUpdateHistory}
        onSelectPrivacyByTokenID={onSelectPrivacyByTokenID}
      />
    );
  }

  renderRefreshControl() {
    const { isLoading, onLoadData } = this.props;
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={onLoadData}
      />
    );
  }

  render() {
    const { histories, onGetHistoryStatus, navigation } = this.props;
    const { showDepositGuide } = this.state;
    return (
      <View style={mainStyle.wrapper}>
        {this.renderHeader()}
        <View style={[dexStyle.scrollViewContainer]}>
          <ScrollView refreshControl={this.renderRefreshControl()}>
            {this.renderMode()}
            <RecentHistory
              histories={histories}
              onGetHistoryStatus={onGetHistoryStatus}
              navigation={navigation}
            />
          </ScrollView>
        </View>
        {this.renderTransfer()}
        <DepositGuide
          onClose={this.closeDepositGuide}
          visible={showDepositGuide}
        />
      </View>
    );
  }
}

Dex.propTypes = {
  accounts: PropTypes.array.isRequired,
  tokens: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  histories: PropTypes.array.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onUpdateHistory: PropTypes.func.isRequired,
  onGetHistoryStatus: PropTypes.func.isRequired,
  onGetHistories: PropTypes.func.isRequired,
  onSelectPrivacyByTokenID: PropTypes.func.isRequired,
  onLoadData: PropTypes.func.isRequired,
  dexMainAccount: PropTypes.object.isRequired,
  dexWithdrawAccount: PropTypes.object.isRequired,
  pairs: PropTypes.array.isRequired,
  pairTokens: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  shares: PropTypes.object.isRequired,
};

export default Dex;
