import React from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, Text, View } from '../core';
import styled from './styles';


const FloatButton = ({ onPress, label, style, isFeedback }) => {
  return (
    <View
      style={[{ position: 'absolute', bottom: 0, left: 0 }, style]}
    >
      <TouchableOpacity
        style={styled.floatBtn}
        onPress={onPress}
      >
        <View style={styled.btnIcon}>

          {isFeedback && isFeedback ?
            <Image source={require('../../assets/images/icons/ic_feedback_btn.png')} style={styled.icon} /> :
            <Icon name="chevron-right" />}
        </View>
        <Text style={styled.text}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
};

FloatButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
};

FloatButton.defaultProps = {
  style: null,
};

export default FloatButton;
