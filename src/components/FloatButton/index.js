import React from 'react';
import PropTypes from 'prop-types';
import {isIOS} from '@utils/platform';
import {KeyboardAvoidingView, View} from 'react-native';
import {Icon} from 'react-native-elements';
import { TouchableOpacity, Text } from '../core';
import styled from './styles';

const Wrapper = isIOS() ? KeyboardAvoidingView : View;

const FloatButton = ({ onPress, label }) => {
  return (
    <Wrapper
      contentContainerStyle={{ position: 'absolute', bottom: 0 }}
      style={{ position: 'absolute', bottom: 0 }}
      keyboardVerticalOffset={isIOS() ? 160 : 0}
      behavior={isIOS() ? 'position' : undefined}
    >
      <TouchableOpacity
        style={styled.floatBtn}
        onPress={onPress}
      >
        <View style={styled.btnIcon}>
          <Icon name="chevron-right" />
        </View>
        <Text style={styled.text}>{label}</Text>
      </TouchableOpacity>
    </Wrapper>
  );
};

FloatButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default FloatButton;