import {
  Text,
  View,
  ActivityIndicator,
  Button
} from '@src/components/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated } from 'react-native';
import { UTILS } from '@src/styles';
import style from './style';

class GetStarted extends Component {
  state = {
    moveAni: new Animated.Value(0),
  };

  componentDidMount() {
    const { moveAni } = this.state;
    this.animation = Animated.loop(
      Animated.sequence([
        Animated.timing(
          moveAni,
          {
            toValue: UTILS.deviceWidth() - (100 /* bar size */ + 60 /* container padding */ ),
            duration: 500,
          }
        ),
        Animated.timing(
          moveAni,
          {
            toValue: 0,
            duration: 500,
          }
        )
      ])
    ).start();
  }

  render() {
    const { isInitialing, errorMsg, isCreating, onRetry }  = this.props;
    const { moveAni } = this.state;

    return (
      <View style={style.container}>
        {
          isInitialing && (
            <View style={style.bar}>
              <Animated.View
                style={[
                  style.barHighlight,
                  {
                    transform: [{ translateX: moveAni }]
                  }
                ]}
              />
            </View>
          )
        }
        <View style={style.getStartedBlock}>
          <Text style={[style.title, style.centerText]}>
            {
              isCreating ? 'Creating your wallet... This process may take several seconds.' : 'Welcome to Incognito. Loading your Wallet...'
            }
          </Text>
          { errorMsg && <Text style={[style.errorMsg, style.centerText]}>{errorMsg}</Text> }
          { errorMsg && <Button style={style.retryBtn} title='Retry' onPress={onRetry} /> }
        </View>
      </View>
    );
  }
}

GetStarted.defaultProps = {
  errorMsg: null,
  isInitialing: true,
  isCreating: false,
  onRetry: null
};

GetStarted.propTypes = {
  errorMsg: PropTypes.string,
  isInitialing: PropTypes.bool,
  isCreating: PropTypes.bool,
  onRetry: PropTypes.func
};

export default GetStarted;
