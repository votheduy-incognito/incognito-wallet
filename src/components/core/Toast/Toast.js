import React, { Component } from 'react';
import { Animated } from 'react-native';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@src/styles';
import Text from '../Text';
import styles from './style';

let instance;

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: null,
      config: {},
      opacityAni: new Animated.Value(1)
    };
  }

  static show(...params) {
    if (typeof instance?.show === 'function') {
      instance.show(...params);
    }
  }

  static showSuccess(msg, config) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <MdIcons name='check' size={20} color={COLORS.white} />,
      containerStyle: styles.successContainer
    });
  }

  static showError(msg, config) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <MdIcons name='error' size={20} color={COLORS.white} />,
      containerStyle: styles.errorContainer
    });
  }

  static showInfo(msg, config) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <MdIcons name='info' size={20} color={COLORS.white} />,
      containerStyle: styles.infoContainer,
      duration: 2500
    });
  }

  static showWarning(msg, config) {
    Toast.show(msg, {
      ...typeof config === 'object' ? config : {},
      icon: <MdIcons name='warning' size={20} color={COLORS.dark1} />,
      containerStyle: styles.warningContainer,
      messageStyle: styles.warningMessage
    });
  }

  componentDidMount() {
    instance = this;
  }

  show = (msg, config = {}) => {
    const { opacityAni } = this.state;
    this.setState({
      msg,
      config: config || {}
    }, () => {
      Animated.sequence([
        Animated.timing(
          opacityAni,
          {
            toValue: 1,
            duration: 300,
          }
        ),
        Animated.delay(config?.duration || 4000),
        Animated.timing(
          opacityAni,
          {
            toValue: 0,
            duration: 200,
          }
        )
      ]).start(({ finished}) => {
        if (finished) {
          this.setState({ msg: null });
        }
      });     
    });
  }

  render() {
    const { msg, config, opacityAni } = this.state;

    if (msg) {
      return (
        <Animated.View
          style={
            [
              styles.container,
              config?.containerStyle,
              {
                opacity: opacityAni
              }
            ]
          }
        >
          {config?.icon}
          <Text
            numberOfLines={10}
            ellipsizeMode='tail'
            style={
              [
                styles.message,
                config?.messageStyle,
              ]
            }
          >
            {msg}
          </Text>
        </Animated.View>
      );
    }
    
    return null;
  }
}

export default Toast;