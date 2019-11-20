import React from 'react';
import PropTypes from 'prop-types';
import {View, Image, Button} from '@src/components/core';
import OptionMenu from '@components/OptionMenu/OptionMenu';
import withdrawBlack from '@assets/images/icons/withdraw_black.png';
import DepositGuide from '@screens/Dex/components/DepositGuide';
import Swap from './Swap';
import Pool from './Pool';
import { mainStyle } from './style';

const MODES = [
  {
    type: 'swap',
    name: 'Swap',
    Component: Swap
  }, {
    type: 'pool',
    name: 'Pool',
    Component: Pool
  }
];

class Dex extends React.Component {
  state = {
    mode: MODES[0],
    showDepositGuide: false,
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


  renderModes() {
    // const { mode } = this.state;
    // return MODES.map(item => (
    //   <TouchableOpacity
    //     key={item.name}
    //     style={[mainStyle.mode, mode === item && mainStyle.modeActive]}
    //     onPress={this.changeMode.bind(this, item)}
    //   >
    //     <Text style={mainStyle.modeText}>{item.name}</Text>
    //   </TouchableOpacity>
    // ));

    return null;
  }

  render() {
    const { wallet, navigation, histories, onAddHistory, onUpdateHistory } = this.props;
    const { mode, transferAction, showDepositGuide } = this.state;
    const { Component } = mode;
    return (
      <View style={mainStyle.wrapper}>
        <View style={mainStyle.header}>
          <View style={mainStyle.twoColumns}>
            <Button
              title="Deposit to trade"
              onPress={() => this.showPopUp('deposit')}
              style={[mainStyle.button, mainStyle.mainButton]}
            />
            <OptionMenu data={this.menu} style={mainStyle.textRight} />
          </View>
        </View>
        <Component
          wallet={wallet}
          navigation={navigation}
          transferAction={transferAction}
          onClosePopUp={this.closePopUp}
          onShowPopUp={this.showPopUp}
          onShowDepositGuide={this.showDepositGuide}
          histories={histories}
          onAddHistory={onAddHistory}
          onUpdateHistory={onUpdateHistory}
        />
        <DepositGuide
          onClose={this.closeDepositGuide}
          visible={showDepositGuide}
        />
      </View>
    );
  }
}

Dex.propTypes = {
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  histories: PropTypes.array.isRequired,
  onAddHistory: PropTypes.func.isRequired,
  onUpdateHistory: PropTypes.func.isRequired,
};


export default Dex;
