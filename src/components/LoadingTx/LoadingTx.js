import { ActivityIndicator, Text, View } from '@src/components/core';
import accountService from '@src/services/wallet/accountService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import styleSheet from './style';

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
    }, 1000);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  clearTimer = () => this.timer && clearInterval(this.timer);

  progress = () => {
    const percent = accountService.getProgressTx();
    percent &&
      this.setState({ percent }, () => {
        if (percent === 100) {
          this.clearTimer();
          setTimeout(() => this.handleToggle(false), 1000);
        }
      });
  };

  handleToggle = isOpen => {
    this.setState(({ open }) => ({ open: isOpen ?? !open }));
  };

  render() {
    const { open, percent } = this.state;
    const { text } = this.props;

    return (
      <Modal animationType="fade" transparent visible={open}>
        <View style={styleSheet.container}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styleSheet.percent}>
            {percent}
            <Text style={styleSheet.percentSymbol}> %</Text>
          </Text>
          <Text style={[styleSheet.desc, styleSheet.extraDesc]}>{text}</Text>
          <Text style={styleSheet.desc}>
            Please wait, this window will close when complete
          </Text>
        </View>
        <KeepAwake />
      </Modal>
    );
  }
}

LoadingTx.defaultProps = {
  text: '',
};

LoadingTx.propTypes = {
  text: PropTypes.string,
};

export default LoadingTx;
