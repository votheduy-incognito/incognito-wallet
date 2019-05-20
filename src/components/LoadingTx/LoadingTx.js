import React, { Component } from 'react';
import { Modal } from 'react-native';
import { View, ActivityIndicator, Text } from '@src/components/core';
import accountService from '@src/services/wallet/accountService';
import styleSheet from './style';
import { COLORS } from '@src/styles';

class LoadingTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      percent: 0,
    };

    this.timer = null;
  }

  componentDidMount() {
    this.handleToggle(true);
    this.timer = setInterval(() => {
      this.progress();
    }, 300);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => clearInterval(this.timer)

  progress = () => {
    const percent = accountService.getProgressTx();
    percent && this.setState({ percent }, () => {
      if (percent === 100) {
        this.clearTimer();
        setTimeout(() => this.handleToggle(false), 1000);
      }
    });
  };

  handleToggle = isOpen => {
    this.setState(({ open}) => ({ open: isOpen ?? !open }));
  }

  render() {
    const { open, percent } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={open}
      >
        <View style={styleSheet.container}>
          <ActivityIndicator size='large' color={COLORS.yellow} />
          <Text style={styleSheet.percent}>{percent} <Text style={styleSheet.percentSymbol}>%</Text></Text>
          <Text style={styleSheet.desc}>Please wait, this window will close when complete</Text>
        </View>
      </Modal>
    );
  }
}

LoadingTx.defaultProps = {
};

LoadingTx.propTypes = {
};

export default LoadingTx;