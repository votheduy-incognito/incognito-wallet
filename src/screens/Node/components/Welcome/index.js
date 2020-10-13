import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import {Text, Image, ScrollView, RoundCornerButton, Toast, ActivityIndicator, Modal, View} from '@components/core';
import nodeImg from '@assets/images/node/node.png';
import NavigationService from '@src/services/NavigationService';
import routeNames from '@src/router/routeNames';
import theme from '@src/styles/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@src/styles';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import appConstant from '@src/constants/app';
import styles from './style';

const WelcomeNodes = ({ onAddPNode, onAddVNode }) => {

  const [ onPress, isDisabled ] = useFeatureConfig(appConstant.DISABLED.BUY_NODE);

  const _onBuyNodePress = async () => {
    if (isDisabled && onPress) {
      onPress();
      return;
    }
    NavigationService.navigate(routeNames.BuyNodeScreen);
  };

  return (
    <ScrollView contentContainerStyle={styles.pNode}>
      <Image style={styles.pNodeImg} source={nodeImg} resizeMode="contain" resizeMethod="resize" />
      <RoundCornerButton
        style={[styles.pNodeButton, theme.BUTTON.NODE_BUTTON]}
        onPress={onAddPNode}
        title='Add Node Device'
      />
      <Text style={styles.buyText}>Don&apos;t have a Node yet?</Text>
      <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={_onBuyNodePress}>
        <Text style={styles.getNode}>Get a Node Device</Text>
        <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow}  />
      </TouchableOpacity>
      <Text style={[styles.buyText, theme.MARGIN.marginTop30]}>Experienced Node operator?</Text>
      <TouchableOpacity style={[theme.FLEX.rowSpaceBetweenCenter]} onPress={onAddVNode}>
        <Text style={styles.getNode}>Add Node Virtual</Text>
        <Ionicons name="ios-arrow-forward" color={COLORS.newGrey} size={20} style={styles.arrow} />
      </TouchableOpacity>
    </ScrollView>
  );
};

WelcomeNodes.propTypes = {
  onAddVNode: PropTypes.func.isRequired,
  onAddPNode: PropTypes.func.isRequired,
};

export default React.memo(WelcomeNodes);
