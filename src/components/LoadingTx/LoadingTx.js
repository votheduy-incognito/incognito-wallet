import { ActivityIndicator, Text, View } from '@src/components/core';
import accountService from '@src/services/wallet/accountService';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import KeepAwake from 'react-native-keep-awake';
import PureModal from '@components/Modal/features/PureModal';
import styleSheet from './style';

class LoadingTx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      percent: 0,
      message: '',
    };

    this.timer = null;
  }

  componentDidMount() {
    this.handleToggle(true);
    if (typeof this?.propPercent !== 'undefined') {
      this.timer = setInterval(() => {
        this.progress();
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (typeof this?.propPercent !== 'undefined') {
      this.clearTimer();
    }
  }

  clearTimer = () => this.timer && clearInterval(this.timer);

  progress = () => {
    const percent = accountService.getProgressTx();
    const message = accountService.getDebugMessage();
    percent &&
      this.setState({ percent, message }, () => {
        if (percent === 100) {
          this.clearTimer();
          setTimeout(() => this.handleToggle(false), 1000);
        }
      });
  };

  handleToggle = (isOpen) => {
    this.setState(({ open }) => ({ open: isOpen ?? !open }));
  };

  renderModalContent = () => {
    const { percent, message } = this.state;
    const { text, propPercent, descFactories } = this.props;
    const totalPercent =
      typeof propPercent !== 'undefined' ? propPercent : percent;
    return (
      <View style={styleSheet.container}>
        <View style={styleSheet.wrapper}>
          <ActivityIndicator size="large" color={COLORS.black} />
          <Text style={styleSheet.percent}>{`${totalPercent}%`}</Text>
          {!!text && (
            <Text style={[styleSheet.desc, styleSheet.extraDesc]}>{text}</Text>
          )}
          {descFactories ? (
            descFactories?.map((item) => (
              <Text style={[styleSheet.desc, item?.styled]}>{item?.desc}</Text>
            ))
          ) : (
            <Text style={styleSheet.desc}>
              {'Please do not navigate away till this\nwindow closes.'}
            </Text>
          )}
          {!!global.isDebug() && !!message && (
            <Text style={styleSheet.desc}>{message}</Text>
          )}
        </View>
        <KeepAwake />
      </View>
    );
  };

  render() {
    const { open } = this.state;
    return <PureModal visible={open} content={this.renderModalContent()} />;
  }
}

LoadingTx.defaultProps = {
  text: '',
  propPercent: undefined,
  descFactories: [],
};

LoadingTx.propTypes = {
  text: PropTypes.string,
  propPercent: PropTypes.number,
  descFactories: PropTypes.array,
};

export default LoadingTx;
