import {
  Text,
  View,
  ActivityIndicator,
  Button
  , Animated } from 'react-native';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { UTILS } from '@src/styles';
import _ from 'lodash';
import style from './style';

class LongLoading extends Component {
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
    const { isInitialing,isCreating, onRetry,message={} }  = this.props;
    const {successful='',errorMsg=''} = message;
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
          <Text style={[style.title, style.centerText]}>This process may take several seconds</Text>
          {/* { errorMsg && <Text style={[style.errorMsg, style.centerText]}>{errorMsg||''}</Text> } */}
          {/* { errorMsg && !_.isNil(onRetry)&& <Button style={style.retryBtn} title='Retry' onPress={onRetry} /> } */}
        </View>
      </View>
    );
  }
}

LongLoading.defaultProps = {
  message:{
    errorMsg:'',
    successful:''
  },
  isInitialing: true,
  isCreating: false,
  onRetry: null
};

LongLoading.propTypes = {
  message:PropTypes.object,
  isInitialing: PropTypes.bool,
  isCreating: PropTypes.bool,
  onRetry: PropTypes.func
};

export default LongLoading;
