import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {View, Image, Text, ScrollView, RefreshControl, TouchableOpacity, Button} from '@src/components/core';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import withdrawBlack from '@assets/images/icons/withdraw_black.png';
import DepositGuide from '@screens/Dex/components/DepositGuide';
import Transfer from '@screens/Dex/components/Transfer';
import RecentHistory from '@screens/Dex/components/RecentHistory';
import {MESSAGES} from '@screens/Dex/constants';
import AccountModal from '@screens/Dex/components/AccountModal';
import chevronDown from '@src/assets/images/icons/white_chevron_down.png';
import ModeSelectorModal from './components/ModeSelectorModal';
import { dexStyle, mainStyle } from './style';
import AddPool from './components/AddPool';
import RemovePool from './components/RemovePool';
import Swap from './components/Swap';

const MODES = {
  SWAP: 'trade',
  POOL: 'pool',
};

class Dex extends React.Component {
  state = {
    mode: MODES.SWAP,
    poolMode: MESSAGES.ADD_LIQUIDITY,
    showDepositGuide: false,
    showMode: false,
    showAccountModal: false,
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
      id: 'withdraw',
      icon: <Image source={withdrawBlack} style={{ width: 25, height: 25, resizeMode: 'contain' }} />,
      label: 'Withdraw',
      desc: 'Withdraw funds from your pDEX account to \nanother account',
      handlePress: () => this.showPopUp('withdraw'),
    }
  ];

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

  showModeModal = () => {
    this.setState({ showMode: true });
  };

  closeModeModal = () => {
    this.setState({ showMode: false });
  };

  selectPoolMode = (mode) => {
    this.setState({ poolMode: mode });
    this.closeModeModal();
  };

  showAccountModal = () => {
    this.setState({ showAccountModal: true });
  };

  closeAccountModal = (account) => {
    if (account?.PaymentAddress) {
      const { onLoadData } = this.props;
      onLoadData();
    }
    this.setState({ showAccountModal: false });
  };

  renderModes() {
    const { mode, showAccountModal } = this.state;
    return (
      <View style={dexStyle.header}>
        {_.map(MODES, item => (
          <TouchableOpacity
            style={[dexStyle.mode, mode === item && dexStyle.activeMode]}
            onPress={() => this.changeMode(item)}
          >
            <Text style={[dexStyle.headerText, mode === item && dexStyle.activeText]}>{_.capitalize(item)}</Text>
          </TouchableOpacity>
        ))}
        <AccountModal onClose={this.closeAccountModal} isVisible={showAccountModal} />
      </View>
    );
  }

  renderActions() {
    const { account } = this.props;
    const { mode, showMode, poolMode } = this.state;

    if (mode === MODES.SWAP) {
      return (
        <Button
          title="Deposit to trade"
          onPress={() => this.showPopUp('deposit')}
          style={[mainStyle.button, dexStyle.mainButton]}
        />
      );
    }

    return (
      <>
        <View style={[mainStyle.twoColumns, dexStyle.actions]}>
          <View style={[mainStyle.twoColumns, mainStyle.flex]}>
            <TouchableOpacity style={mainStyle.twoColumns} onPress={this.showAccountModal}>
              <Text style={dexStyle.actionText}>Account: {account.name}</Text>
              <Image source={chevronDown} style={dexStyle.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[mainStyle.twoColumns, mainStyle.textRight, dexStyle.selector]} onPress={this.showModeModal}>
              <Text style={dexStyle.actionText}>{_.capitalize(poolMode)}</Text>
              <Image source={chevronDown} style={dexStyle.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <ModeSelectorModal
          onSelect={this.selectPoolMode}
          isVisible={showMode}
          onClose={this.closeModeModal}
          currentMode={poolMode}
        />
      </>
    );
  }

  renderHeader() {
    const { mode } = this.state;
    return (
      <View style={mainStyle.header}>
        <View style={mainStyle.twoColumns}>
          {this.renderModes()}
          <View style={dexStyle.options}>
            { mode === MODES.SWAP &&<OptionMenu data={this.menu} style={mainStyle.textRight} /> }
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
      account,
      pairTokens,
      shares,
      isLoading,
      followedTokens,
    } = this.props;
    const { addLiquidityParams, poolMode, removeLiquidityParams } = this.state;

    if (poolMode === MESSAGES.ADD_LIQUIDITY) {
      return (
        <AddPool
          account={account}
          wallet={wallet}
          histories={histories}
          onAddHistory={onAddHistory}
          onUpdateHistory={onUpdateHistory}
          onGetHistoryStatus={onGetHistoryStatus}
          onUpdateParams={this.updateAddLiquidityParams}
          params={addLiquidityParams}
          tokens={tokens}
          followedTokens={followedTokens}
          pairTokens={pairTokens}
          pairs={pairs}
          isLoading={isLoading}
        />
      );
    }

    return (
      <RemovePool
        account={account}
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
      pairTokens,
      onAddHistory,
      onUpdateHistory,
      onLoadData,
      onSelectPrivacyByTokenID,
    } = this.props;
    const { transferAction, tradeParams } = this.state;
    return (
      <Transfer
        dexMainAccount={dexMainAccount}
        dexWithdrawAccount={dexWithdrawAccount}
        wallet={wallet}
        accounts={accounts}
        tokens={pairTokens}
        action={transferAction}
        onClosePopUp={this.closePopUp}
        inputToken={tradeParams.inputToken}
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
    const { showDepositGuide, mode } = this.state;
    return (
      <View style={mainStyle.wrapper}>
        {this.renderHeader()}
        <View style={[dexStyle.scrollViewContainer, mode === MODES.POOL && dexStyle.pool]}>
          <View style={dexStyle.scrollViewHeader}>
            {this.renderActions()}
          </View>
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
  account: PropTypes.object.isRequired,
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
  followedTokens: PropTypes.array.isRequired,
};

export default Dex;
