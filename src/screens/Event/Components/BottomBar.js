import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@screens/Event/Event.styles';
import { View, TouchableOpacity } from '@components/core';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@src/styles';

const BottomBar = (props) => {
  const {
    onGoBack,
    onGoForward,
    onReload
  } = props;

  return (
    <View style={styled.navigation}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity onPress={onGoBack} style={styled.back}>
          <Ionicons name="ios-arrow-back" size={30} color={COLORS.colorGreyBold} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onGoForward} style={styled.back}>
          <Ionicons name="ios-arrow-forward" size={30} color={COLORS.colorGreyBold} />
        </TouchableOpacity>
        <TouchableOpacity style={styled.back} />
        <TouchableOpacity onPress={onReload} style={styled.back}>
          <Ionicons name="ios-refresh" size={30} color={COLORS.colorGreyBold} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

BottomBar.propTypes = {
  onGoBack: PropTypes.func.isRequired,
  onGoForward: PropTypes.func.isRequired,
  onReload: PropTypes.func.isRequired
};

export default memo(BottomBar);